<template>
<v-card :loading="loading" class="mx-auto my-12" max-width="374">
    <template slot="progress">
        <v-progress-linear color="deep-purple" height="10" indeterminate></v-progress-linear>
    </template>
    <v-img height="250" :src="imgURL"></v-img>
    <v-card-title>{{ this.product.ItemName }}</v-card-title>
    <v-card-text>
        <v-row align="center" class="mx-0"> </v-row>
        <div class="my-4 text-subtitle-1">RD$ : {{ this.product.Price }}</div>
        <div class="my-4 text-subtitle-1">
            Disponible : {{ this.product.Quantity }}
        </div>
        <div class="my-4 text-subtitle-1">Referencia:</div>
        <div>{{ this.product.ItemCode }} - {{ this.product.ItemName }}</div>
    </v-card-text>
    <v-divider class="mx-4"></v-divider>
    <v-card-title>{{ this.product.ItmsGrpNam }}</v-card-title>
</v-card>
</template>

<script>
import {
    firebaseApp
} from "../firebase";
import {
    getFirestore,
    getDocs,
    collection,
    query,
    where,
} from "firebase/firestore";
import {
    getStorage,
    ref,
    getDownloadURL
} from "firebase/storage";

const db = getFirestore(firebaseApp);

export default {
    data() {
        return {
            itemcode: "",
            loading: false,
            imgURL: "https://cdn.vuetifyjs.com/images/parallax/material.jpg",
            product: {},
        };
    },
    created() {
        this.getProduct();
        this.getImage();
    },
    methods: {
        async getImage() {
            const storage = getStorage();
            getDownloadURL(ref(storage, "images/" + this.itemcode + ".jpg"))
                .then((url) => {
                    // `url` is the download URL for 'images/stars.jpg'
                    this.imgURL = url;
                })
                .catch((error) => {
                    // Handle any errors
                });
        },

        async getProduct() {
            let products = [];
            let querySnapshot;
            this.itemcode = this.$route.params.itemcode;

            if (this.itemcode != undefined) {
                const q = query(
                    collection(db, "OITM"),
                    where("ItemCode", "==", this.itemcode)
                );

                querySnapshot = await getDocs(q);

                querySnapshot.forEach((doc) => {
                    products.push({
                        ItemCode: doc.data().ItemCode,
                        ItemName: doc.data().ItemName,
                        ItmsGrpNam: doc.data().ItmsGrpNam,
                        Price: doc.data().Price.toFixed(2),
                        Quantity: doc.data().Quantity,
                    });
                });
                this.product = products[0];
            }
        },
    },
};
</script>
