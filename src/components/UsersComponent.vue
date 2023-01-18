<template>
<v-layout align-start>
    <v-flex>
        <v-data-table :headers="headers" :search="search" :items="users" :loading="loadingtable" sort-by="username" class="elevation-1">
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Usuarios</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="600px">
                        <template v-slot:activator="{ on }">
                            <v-btn color="blue" dark v-on="on">
                                <v-icon left dark>mdi-account-plus</v-icon>Agregar Usuario
                            </v-btn>
                        </template>
                        <v-form ref="formUser" @submit.prevent>
                            <v-card>
                                <v-card-title>
                                    <span class="headline">Registro</span>
                                </v-card-title>
                                <v-card-text>
                                    <v-text-field v-model.trim="signupForm.name" label="Nombre" name="name" prepend-icon="person" type="text" :rules="[rules.required]"></v-text-field>
                                    <v-text-field v-model.trim="signupForm.username" label="Usuario" name="username" prepend-icon="person" type="text" :rules="[rules.required]"></v-text-field>
                                    <v-text-field v-model.trim="signupForm.email" label="Email" name="email2" prepend-icon="mail" type="text" :rules="[rules.required, rules.email]"></v-text-field>
                                    <v-text-field v-model.trim="signupForm.password" id="password" label="Contraseña" name="password2" prepend-icon="lock" type="password" :rules="[rules.required]"></v-text-field>
                                    <v-flex class="red--text" v-if="error">{{ error }}</v-flex>
                                    <v-btn color="primary" @click="signup">Registrar</v-btn>
                                </v-card-text>
                            </v-card>
                        </v-form>
                    </v-dialog>
                    <v-spacer></v-spacer>
                </v-toolbar>
            </template>
            <template #[`item.actions`]="{ item }">
                <v-icon size="sm" color="red" class="mr-1" @click="deleteUser(item)">delete</v-icon>
            </template>
            <template v-slot:no-data>
                <v-btn color="primary" @click="getUsers(true)">
                    <v-icon left dark>autorenew</v-icon>Refrescar
                </v-btn>
            </template>
        </v-data-table>
    </v-flex>
</v-layout>
</template>

<script>
import {
    getAuth,
    updateProfile,
    createUserWithEmailAndPassword,
} from "firebase/auth";
import {
    firebaseApp
} from "../firebase";
import {
    getFirestore,
    doc,
    setDoc,
    deleteDoc,
    getDocsFromCache,
    getDocs,
    collection,
} from "firebase/firestore";

const auth = getAuth();
const db = getFirestore(firebaseApp);

export default {
    data: () => ({
        dialog: false,
        users: [],
        signupForm: {
            name: "",
            username: "",
            email: "",
            password: "",
        },
        rules: {
            required: (value) => !!value || "Requerido.",
            email: (value) => {
                    const pattern =
                        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                    return pattern.test(value) || "Correo Inválido.";
                },
        },
        headers: [{
                text: "Usuario",
                sortable: true,
                value: "username",
            },
            {
                text: "Nombre",
                sortable: true,
                value: "name",
            },
            {
                text: "Email",
                sortable: false,
                value: "email",
            },
            {
                text: "Opciones",
                value: "actions",
                sortable: false,
            },
        ],
        search: "",
        loadingtable: false,
        error: null,
    }),
    watch: {
        dialog(val) {
            if (!val) {
                this.signupForm = {
                    name: "",
                    username: "",
                    email: "",
                    password: "",
                };
                this.$refs.formUser.resetValidation();
            }
        },
    },
    mounted() {},
    created() {
        this.getUsers(true);
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
        async getUsers(requestData) {
            this.loadingtable = true;
            this.users = [];
            let querySnapshot;

            if (requestData) {
                querySnapshot = await getDocs(collection(db, "profiles"));
            } else {
                querySnapshot = await getDocsFromCache(collection(db, "profiles"));
            }
            querySnapshot.forEach((doc) => {
                this.users.push({
                    Id: doc.id,
                    username: doc.data().username,
                    name: doc.data().name,
                    email: doc.data().email,
                });
            });
            this.loadingtable = false;
        },
        async signup() {
            const auth = getAuth();
            const profilesRef = collection(db, "profiles");
            createUserWithEmailAndPassword(
                    auth,
                    this.signupForm.email,
                    this.signupForm.password
                )
                .then((userCredential) => {
                    // Signed in
                    let registeredUser = userCredential.user;
                    //Registra o perfil
                    setDoc(doc(profilesRef, registeredUser.uid), {
                            name: this.signupForm.name,
                            email: this.signupForm.email,
                            username: this.signupForm.username,
                        })
                        .then(() => {
                            console.log("se creo el profile");
                            updateProfile(auth.currentUser, {
                                    displayName: this.signupForm.username,
                                })
                                .then(() => {
                                    this.dialog = false;
                                    this.getUsers();
                                })
                                .catch(() => console.log);
                        })
                        .catch(() => console.log);
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode + " - " + errorMessage);
                    this.error = errorMessage;
                });
        },
        async deleteUser(user) {
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
                        this.deleteUserById(user.Id);
                        this.getUsers(true);
                    }
                });
        },
        async deleteUserById(Id) {
            await deleteDoc(doc(db, "profiles", Id));
        },
    },
};
</script>
