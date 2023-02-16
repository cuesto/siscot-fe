<template>
<v-layout align-start>
    <v-flex>
        <v-card>
            <v-container>
                <v-row cols="6">
                    <v-col>
                        <v-card>
                            <v-dialog v-model="dialog" max-width="600px">
                                <v-card>
                                    <v-card-title>
                                        <span class="headline">Imprimir Cotización</span>
                                    </v-card-title>
                                    <v-card-text v-if="dialog">
                                        <InvoicePrint />
                                    </v-card-text>
                                </v-card>
                            </v-dialog>
                            <v-data-table :items-per-page="10" :footer-props="{
                    'items-per-page-options': [10, 15, 20, 25, 50],
                  }" :headers="headersQuotes" :search="searchQuote" :items="quotes" class="elevation-1" :loading="loadingQT">
                                <template v-slot:top>
                                    <v-toolbar flat color="#b3e5cc">
                                        <v-toolbar-title>Cotizaciones</v-toolbar-title>
                                        <v-divider class="mx-4" inset vertical></v-divider>
                                        <v-spacer></v-spacer>
                                        <v-text-field class="text-xs-center" v-model="searchQuote" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
                                    </v-toolbar>
                                </template>
                                <template #[`item.options`]="{ item }">
                                    <!-- <v-icon size="sm" color="gray" class="mr-1" @click="printQuote(item)">print</v-icon> -->
                                    <v-icon v-if="item.IsTransfered == true" size="sm" variant="outline-info" color="green" class="mr-1">done_outline</v-icon>
                                    <v-icon v-if="item.IsTransfered == true" size="sm" variant="outline-info" color="blue" class="mr-1" @click="viewQuote(item)">remove_red_eye</v-icon>
                                    <v-icon v-if="item.IsTransfered == false" size="sm" variant="outline-info" color="blue" class="mr-1" @click="editQuote(item)">edit</v-icon>
                                    <v-icon v-if="item.IsTransfered == false" size="sm" color="red" class="mr-1" @click="deleteQuote(item)">delete</v-icon>
                                </template>
                                <template v-slot:no-data>
                                    <v-btn color="primary" @click="getQuotes(true)">
                                        <v-icon left dark>autorenew</v-icon>Refrescar
                                    </v-btn>
                                </template>
                            </v-data-table>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </v-flex>
</v-layout>
</template>

<script>
import router from "../router";
import InvoicePrint from "../components/InvoicePrintComponent.vue";
import {
    firebaseApp
} from "../firebase";
import {
    getFirestore,
    doc,
    getDocsFromCache,
    getDocs,
    deleteDoc,
    collection,
} from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default {
    components: {
        InvoicePrint,
    },
    data: () => ({
        loadingQT: false,
        dialog: false,
        searchQuote: "",
        quotes: [],
        headersQuotes: [{
                text: "Id",
                value: "IdDisplay"
            },
            {
                text: "Fecha Documento",
                sortable: true,
                value: "DocDate"
            },
            {
                text: "Cliente",
                sortable: true,
                value: "Client"
            },
            {
                text: "Comentarios",
                sortable: true,
                value: "Comments"
            },
            {
                text: "Total",
                sortable: true,
                value: "Total"
            },
            {
                text: "DocNum SAP",
                sortable: true,
                value: "DocNum"
            },
            {
                text: "Log",
                value: "Log"
            },
            {
                text: "Opciones",
                value: "options",
                sortable: false
            },
        ],
    }),
    mounted() {
        this.getQuotes(true);
    },

    methods: {
        printQuote(item) {
            this.dialog = true;
        },

        displayNotification(type, message) {
            this.$swal.fire({
                position: "top-end",
                type: type,
                title: message,
                showConfirmButton: false,
                timer: 2500,
            });
        },

        async getQuotes(requestData) {
            this.loadingQT = true;
            this.quotes = [];
            let querySnapshot;

            if (requestData) {
                querySnapshot = await getDocs(collection(db, "OQUT"));
            } else {
                querySnapshot = await getDocsFromCache(collection(db, "OQUT"));
            }
            querySnapshot.forEach((doc) => {
                this.quotes.push({
                    Id: doc.id,
                    IdDisplay: doc.id.substring(0, 6),
                    Client: doc.data().CardCode + "-" + doc.data().CardName,
                    DocDate: doc.data().DocDate,
                    DocEntry: doc.data().DocEntry,
                    DocNum: doc.data().DocNum,
                    Log: doc.data().Log,
                    Comments: doc.data().Comments,
                    IsTransfered: doc.data().IsTransfered,
                    Total: doc.data().Total,
                });
            });
            this.loadingQT = false;
        },

        editQuote(item) {
            router.push({
                name: "quotesId",
                params: {
                    id: item.Id
                },
            });
        },

        viewQuote(item) {
            router.push({
                name: "quotesIdView",
                params: {
                    id: item.Id,
                    disabled: true
                },
            });
        },

        async deleteQuote(item) {
            this.$swal
                .fire({
                    title: "¿Está Seguro de borrar este registro?",
                    text: "¡No será posible revertir el cambio!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    confirmButtonText: "¡Si!",
                    cancelButtonText: "Cancelar",
                })
                .then((result) => {
                    if (result.value) {
                        console.log(item.Id);
                        this.deleteItem(item.Id);
                        this.getQuotes(true);
                    }
                });
        },

        async deleteItem(Id) {
            await deleteDoc(doc(db, "OQUT", Id));
        },
    },
};
</script>
