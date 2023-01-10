<template>
<v-layout align-start>
    <v-flex>
        <!-- <StreamBarcodeReader @decode="onDecode" @loaded="onLoaded"></StreamBarcodeReader>
  <h2>The decoded value in QR/barcode is</h2>
  <h2>{{ decodedText }}</h2> -->
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
                            <v-card-text>
                                <StreamBarcodeReader @decode="(a, b, c) => onDecode(a, b, c)" @loaded="() => onLoaded()"></StreamBarcodeReader>
                                <h2>The decoded value in QR/barcode is {{text}}</h2>
                                <small>*Campo requerido.</small>
                            </v-card-text>
                            <!-- <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="dialog = false"
                    >Cerrar</v-btn
                  >
                  <v-btn color="green" dark text @click="save">
                    <v-icon left>save</v-icon>Guardar
                  </v-btn>
                </v-card-actions> -->
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
    firebaseApp
} from "../firebase";
import {
    getFirestore,
    doc,
    getDocsFromCache,
    getDocs,
    setDoc,
    deleteDoc,
    collection,
} from "firebase/firestore";

import {
    StreamBarcodeReader
} from "vue-barcode-reader";

const db = getFirestore(firebaseApp);

export default {
    components: {
        StreamBarcodeReader,
    },
    data: () => ({
        text: "",
        id: null,
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
                text: "Cantidad Disponible",
                sortable: false,
                value: "Quantity",
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
        // this.getClients();
        this.getProducts(false);
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
            console.log("ojo");
        },

        onDecode(a, b, c) {
            console.log(a, b, c);
            this.text = a;
            if (this.id) clearTimeout(this.id);
            this.id = setTimeout(() => {
                if (this.text === a) {
                    this.text = "";
                }
            }, 5000);
        },
        onLoaded() {
            console.log("load");
        },

        // async getClients() {
        //     this.loadingtable = true;
        //     this.clients = [];
        //     const querySnapshot = await getDocsFromCache(
        //         collection(db, "profiles/" + auth.currentUser.uid + "/clients")
        //     );
        //     querySnapshot.forEach((doc) => {
        //         this.clients.push({
        //             id: doc.data().id,
        //             name: doc.data().name,
        //             phone: doc.data().phone,
        //             lastName: doc.data().lastName,
        //             email: doc.data().email,
        //         });
        //     });
        //     this.loadingtable = false;
        // },

        async getProducts(requestData) {
            this.loadingtable = true;
            this.products = [];
            let querySnapshot;

            console.log(requestData);

            if (requestData == true) {
                querySnapshot = await getDocs(collection(db, "OITM"));
            } else {
                querySnapshot = await getDocsFromCache(collection(db, "OITM"));
            }

            //querySnapshot = await getDocsFromCache(collection(db, "OITM"));
            querySnapshot.forEach((doc) => {
                this.products.push({
                    ItemCode: doc.data().ItemCode,
                    ItemName: doc.data().ItemName,
                    ItmsGrpNam: doc.data().ItmsGrpNam,
                    Price: doc.data().Price.toFixed(2),
                    Quantity: doc.data().Quantity,
                });
            });
            this.loadingtable = false;
        },
    },
};
</script>
