<template>
<v-layout align-start>
    <v-flex>
        <v-data-table :headers="headers" :search="search" :items="products" :loading="loadingtable" sort-by="ItemName" class="elevation-1">
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Productos</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>

                    <v-dialog v-model="dialog" max-width="600px">
                        <template v-slot:activator="{ on }">
                            <v-btn color="blue" dark v-on="on">
                                <v-icon left dark>mdi-qrcode-scan</v-icon>Escanear
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">Escanear Código</span>
                            </v-card-title>
                            <v-card-text v-if="dialog">
                                <StreamBarcodeReader @decode="(a, b, c) => onDecode(a, b, c)" @loaded="() => onLoaded()"></StreamBarcodeReader>
                            </v-card-text>
                        </v-card>
                    </v-dialog>
                    <v-spacer></v-spacer>
                </v-toolbar>
            </template>
            <template #[`item.actions`]="{ item }">
                <v-icon size="sm" variant="outline-info" color="blue" class="mr-1" @click="viewItem(item)">mdi-eye</v-icon>
            </template>
            <template v-slot:no-data>
                <v-btn color="primary" @click="getProducts(true)">
                    <v-icon left dark>autorenew</v-icon>Refrescar
                </v-btn>
            </template>
        </v-data-table>
    </v-flex>
</v-layout>
</template>

<script>
import {
    StreamBarcodeReader
} from "vue-barcode-reader";
import {
    firebaseApp
} from "../firebase";
import {
    getFirestore,
    getDocsFromCache,
    getDocs,
    collection,
} from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default {
    components: {
        StreamBarcodeReader,
    },
    data: () => ({
        dialog: false,
        products: [],
        headers: [{
                text: "Id",
                sortable: true,
                value: "ItemCode",
            },
            {
                text: "Nombre",
                sortable: true,
                value: "ItemName",
            },
            {
                text: "Grupo",
                sortable: true,
                value: "ItmsGrpNam",
            },
            {
                text: "Precio",
                sortable: false,
                value: "Price",
            },
            {
                text: "Castellana",
                sortable: false,
                value: "Castellana",
            },
            {
                text: "Exhibición Castellana",
                sortable: false,
                value: "Exhibicion_Castellana",
            },
            {
                text: "Alameda",
                sortable: false,
                value: "Alameda",
            },
            {
                text: "Exhibición Alameda",
                sortable: false,
                value: "Exhibicion_Alameda",
            },
            {
                text: "Santiago",
                sortable: false,
                value: "Santiago",
            },
            {
                text: "Exhibición Santiago",
                sortable: false,
                value: "Exhibicion_Santiago",
            },
            {
                text: "Punta Cana",
                sortable: false,
                value: "Punta_Cana",
            },
            {
                text: "Exhibición Punta Cana",
                sortable: false,
                value: "Exhibicion_Punta_Cana",
            },
            {
                text: "Opciones",
                value: "actions",
                sortable: false,
            },
        ],
        search: "",
        loadingtable: false,
    }),
    watch: {},
    mounted() {},
    created() {
        this.getProducts(true);
    },
    methods: {
        displayNotification(type, message) {
            this.$swal.fire({
                position: "top-end",
                type: type,
                title: message,
                showConfirmButton: false,
                timer: 1500,
            });
        },

        viewItem(item) {
            console.log(item);
        },

        onDecode(a, b, c) {
            this.search = a;
            this.dialog = false;
        },

        onLoaded() {},

        async getProducts(requestData) {
            this.loadingtable = true;
            this.products = [];
            let querySnapshot;

            if (requestData) {
                querySnapshot = await getDocs(collection(db, "OITM"));
            } else {
                querySnapshot = await getDocsFromCache(collection(db, "OITM"));
            }
            querySnapshot.forEach((doc) => {
                this.products.push({
                    ItemCode: doc.data().ItemCode,
                    ItemName: doc.data().ItemName,
                    ItmsGrpNam: doc.data().ItmsGrpNam,
                    Price: doc.data().Price.toFixed(2),
                    Castellana: doc.data().Castellana,
                    Exhibicion_Castellana: doc.data().Exhibicion_Castellana,
                    Alameda: doc.data().Alameda,
                    Santiago: doc.data().Santiago,
                    Exhibicion_Santiago: doc.data().Exhibicion_Santiago,
                    Punta_Cana: doc.data().Punta_Cana,
                    Exhibicion_Punta_Cana: doc.data().Exhibicion_Punta_Cana,
                    Exhibicion_Alameda: doc.data().Exhibicion_Alameda,

                });
            });
            this.loadingtable = false;
        },
    },
};
</script>
