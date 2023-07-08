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
                <v-dialog v-model="dialogSO" max-width="600px">
                  <v-form ref="formDialogSO">
                    <v-card>
                      <v-card-title>
                        <span class="headline"
                          >Campos Requeridos Orden de Venta</span
                        >
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="6" sm="6" md="6">
                              <v-select
                                undefined
                                v-model="udfModel.Indicator"
                                :items="indicators"
                                item-text="Name"
                                item-value="Code"
                                :rules="[rules.required]"
                                color="blue-grey lighten-2"
                                label="Tienda"
                              ></v-select>
                            </v-col>
                            <v-col cols="6" sm="6" md="6">
                              <v-select
                                undefined
                                v-model="udfModel.SalesPersonCode"
                                :items="salesPersons"
                                item-text="SlpName"
                                item-value="SlpCode"
                                :rules="[rules.required]"
                                color="blue-grey lighten-2"
                                label="Vendedor"
                              ></v-select>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="6" sm="6" md="6">
                              <v-select
                                undefined
                                v-model="udfModel.TransportationCode"
                                :items="transports"
                                item-text="TrnspName"
                                item-value="TransportationCode"
                                :rules="[rules.required]"
                                color="blue-grey lighten-2"
                                label="Tipo Despacho"
                              ></v-select>
                            </v-col>
                            <v-col cols="6" sm="6" md="6">
                              <v-select
                                undefined
                                v-model="udfModel.PaymentGroupCode"
                                :items="paymentgroups"
                                item-text="PymntGroup"
                                item-value="PaymentGroupCode"
                                :rules="[rules.required]"
                                color="blue-grey lighten-2"
                                label="Condiciones de pago"
                              ></v-select>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="12" md="12">
                              <v-text-field
                                label="Destino"
                                :rules="[rules.required]"
                                v-model="udfModel.Address2"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="6" sm="6" md="6">
                              <v-select
                                undefined
                                v-model="udfModel.U_PagoVirtual"
                                :items="U_PagoVirtual"
                                :rules="[rules.required]"
                                color="blue-grey lighten-2"
                                label="Pago Virtual"
                              ></v-select>
                            </v-col>
                            <v-col
                              cols="6"
                              sm="6"
                              md="6"
                              v-if="udfModel.U_PagoVirtual == 'SI'"
                            >
                              <v-select
                                undefined
                                v-model="udfModel.U_TipodeTC"
                                :items="U_TipodeTC"
                                :rules="[rules.required]"
                                color="blue-grey lighten-2"
                                label="Tipo de TC"
                              ></v-select>
                            </v-col>
                          </v-row>
                          <v-row v-if="udfModel.U_PagoVirtual == 'SI'">
                            <v-col cols="6" sm="6" md="6">
                              <v-menu
                                v-model="menuDocDate"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                              >
                                <template v-slot:activator="{ on }">
                                  <v-text-field
                                    v-model="udfModel.U_FechadeVencimientoTC"
                                    label="Fecha de Vencimiento TC"
                                    prepend-icon="event"
                                    readonly
                                    :rules="[rules.required]"
                                    v-on="on"
                                  ></v-text-field>
                                </template>
                                <v-date-picker
                                  v-model="udfModel.U_FechadeVencimientoTC"
                                  @input="menuDocDate = false"
                                ></v-date-picker>
                              </v-menu>
                            </v-col>
                            <v-col cols="6" sm="6" md="6">
                              <v-select
                                undefined
                                v-model="udfModel.U_NombredelBanco"
                                :items="U_NombredelBanco"
                                :rules="[rules.required]"
                                color="blue-grey lighten-2"
                                label="Nombre del Banco"
                              ></v-select>
                            </v-col>
                          </v-row>
                          <v-row v-if="udfModel.U_PagoVirtual == 'SI'">
                            <v-col cols="6" sm="6" md="6">
                              <v-select
                                undefined
                                v-model="udfModel.U_MedioDepago"
                                :items="U_MedioDepago"
                                :rules="[rules.required]"
                                color="blue-grey lighten-2"
                                label="Medio de Pago"
                              ></v-select>
                            </v-col>
                            <v-col cols="6" sm="6" md="6">
                              <v-select
                                undefined
                                v-model="udfModel.U_TipoDeModena"
                                :items="U_TipoDeModena"
                                :rules="[rules.required]"
                                color="blue-grey lighten-2"
                                label="Tipo de Moneda"
                              ></v-select>
                            </v-col>
                          </v-row>
                          <v-row v-if="udfModel.U_PagoVirtual == 'SI'">
                            <v-col cols="6" sm="6" md="6">
                              <v-select
                                undefined
                                v-model="udfModel.U_NombreTC"
                                :items="U_NombreTCList"
                                item-text="name"
                                item-value="code"
                                :rules="[rules.required]"
                                color="blue-grey lighten-2"
                                label="Nombre TC"
                              ></v-select>
                            </v-col>
                          </v-row>
                        </v-container>
                        <small>*indica campo requerido.</small>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="red darken-1"
                          text
                          @click="dialogSO = false"
                          >Cerrar</v-btn
                        >
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="createSalesOrder"
                          >Agregar</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </v-form>
                </v-dialog>
                <v-data-table
                  :items-per-page="10"
                  :footer-props="{
                    'items-per-page-options': [10, 15, 20, 25, 50],
                  }"
                  :headers="headersQuotes"
                  :search="searchQuote"
                  :items="quotes"
                  class="elevation-1"
                  :loading="loadingQT"
                >
                  <template v-slot:top>
                    <v-toolbar flat color="#b3e5cc">
                      <v-toolbar-title>Cotizaciones</v-toolbar-title>
                      <v-divider class="mx-4" inset vertical></v-divider>
                      <v-spacer></v-spacer>
                      <v-text-field
                        class="text-xs-center"
                        v-model="searchQuote"
                        append-icon="search"
                        label="Búsqueda"
                        single-line
                        hide-details
                      ></v-text-field>
                    </v-toolbar>
                  </template>
                  <template #[`item.options`]="{ item }">
                    <!-- <v-icon size="sm" color="gray" class="mr-1" @click="printQuote(item)">print</v-icon> -->

                    <v-icon
                      v-if="item.IsTransfered == true"
                      size="sm"
                      variant="outline-info"
                      color="green"
                      class="mr-1"
                      >done_outline</v-icon
                    >
                    <v-icon
                      v-if="
                        item.IsTransfered == true && item.IsSalesOrder == false
                      "
                      size="sm"
                      variant="outline-info"
                      color="purple"
                      class="mr-1"
                      @click="openDialogSO(item)"
                      >mdi-file-document-arrow-right</v-icon
                    >
                    <v-icon
                      v-if="item.IsTransfered == true"
                      size="sm"
                      variant="outline-info"
                      color="blue"
                      class="mr-1"
                      @click="viewQuote(item)"
                      >remove_red_eye</v-icon
                    >
                    <v-icon
                      v-if="item.IsTransfered == false"
                      size="sm"
                      variant="outline-info"
                      color="blue"
                      class="mr-1"
                      @click="editQuote(item)"
                      >edit</v-icon
                    >
                    <v-icon
                      v-if="item.IsTransfered == false"
                      size="sm"
                      color="red"
                      class="mr-1"
                      @click="deleteQuote(item)"
                      >delete</v-icon
                    >
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
import { firebaseApp } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDocsFromCache,
  getDocs,
  deleteDoc,
  collection,
  updateDoc,
} from "firebase/firestore";

const auth = getAuth();
const db = getFirestore(firebaseApp);
const quotationRef = collection(db, "OQUT");

export default {
  components: {
    InvoicePrint,
  },
  data: () => ({
    loadingQT: false,
    dialog: false,
    dialogSO: false,
    menuDocDate: false,
    searchQuote: "",
    quotes: [],
    quoteId: "",
    udfModel: {},
    indicators: [],
    salesPersons: [],
    transports: [],
    paymentgroups: [],
    U_PagoVirtual: ["SI", "NO"],
    U_TipodeTC: ["AMERICAN EXPRESS", "ATH", "DISCOVER", "MASTER CARD", "VISA"],
    U_NombredelBanco: [
      "Asociación La Nacional",
      "Asociacion Popular",
      "Bancamérica RD$",
      "Bancamérica US$",
      "Banco Ademi",
      "Banco Alaver",
      "Banco BDI",
      "Banco BHD",
      "Banco BHD USD",
      "Banco BHDLeon",
      "Banco Caribe",
      "Banco de Ahorro y Crédito Inmobiliario (BANASI)",
      "Banco de Reservas USD",
      "Banco del Progreso",
      "Banco del Progreso US",
      "Banco del Reservas",
      "Banco Lafise",
      "Banco Leon RD$",
      "Banco Leon US$",
      "Banco Múltiple López de Haro",
      "Banco of America",
      "Banco Popular Dominicano",
      "Banco Promerica",
      "Banco Sabadell Miami",
      "Banco Santa Cruz",
      "Banco Santader",
      "Banco Unión",
      "Banco Vimenca",
      "Banesco",
      "BNP Paribas",
      "Chase",
      "City National Bank CNB",
      "CityBank",
      "CNB Bank",
      "HSBC Private Banck",
      "Mocana De Ahorro y Prestamos",
      "Popular Bank (US$)",
      "Regions",
      "Scotiabank",
      "Terrabank",
      "TotalBank",
      "Wachovia Bank",
      "Yubboa",
    ],
    U_MedioDepago: ["TC", "Transferencia"],
    U_TipoDeModena: ["Euro", "Pesos Dominicanos", "US Dolar"],
    U_NombreTCList: [
      {
        code: "1",
        name: "N/A",
      },
      {
        code: "2",
        name: "Banco BHD Leon",
      },
    ],
    headersQuotes: [
      {
        text: "Id",
        value: "IdDisplay",
      },
      {
        text: "Fecha Documento",
        sortable: true,
        value: "DocDate",
      },
      {
        text: "Cliente",
        sortable: true,
        value: "Client",
      },
      {
        text: "Comentarios",
        sortable: true,
        value: "Comments",
      },
      {
        text: "Total",
        sortable: true,
        value: "Total",
      },
      {
        text: "DocNum SAP",
        sortable: true,
        value: "DocNum",
      },
      {
        text: "Log",
        value: "Log",
      },
      {
        text: "Opciones",
        value: "options",
        sortable: false,
      },
    ],
    rules: {
      required: (value) => !!value || "Requerido.",
      positivevalue: (value) =>
        value >= 0 || "Solo se admiten valores positivos.",
      email: (value) => {
        const pattern =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return pattern.test(value) || "Correo Inválido.";
      },
    },
    uid: "",
  }),
  mounted() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.uid = user.uid;
      }
    });

    this.getIndicators(true);
    this.getSalesPersons(true);
    this.getTransports(true);
    this.getPaymentGroups(true);
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
          IsSalesOrder: doc.data().IsSalesOrder,
          Total: doc.data().Total,
          CreatedBy: doc.data().CreatedBy,
        });
      });
      const newArray = [];

      for (const element of this.quotes) {
        if (element.CreatedBy === this.uid) {
          newArray.push(element);
        }
      }

      this.quotes = [];
      this.quotes = newArray;
      this.loadingQT = false;
    },

    async getIndicators(requestData) {
      this.indicators = [];
      let querySnapshot = await this.getDataFromFirebase(requestData, "OIDC");

      querySnapshot.forEach((doc) => {
        this.indicators.push({
          Code:
            doc.data().Code < 10 ? "0" + doc.data().Code : "" + doc.data().Code,
          Name: doc.data().Name,
        });
      });
    },

    async getSalesPersons(requestData) {
      this.salesPersons = [];
      let querySnapshot = await this.getDataFromFirebase(requestData, "OSLP");

      querySnapshot.forEach((doc) => {
        if (doc.data().Active == "Y") {
          this.salesPersons.push({
            SlpCode: doc.data().SlpCode,
            SlpName: doc.data().SlpName,
          });
        }
      });
    },

    async getTransports(requestData) {
      this.transports = [];
      let querySnapshot = await this.getDataFromFirebase(requestData, "OSHP");

      querySnapshot.forEach((doc) => {
        this.transports.push({
          TransportationCode: doc.data().TransportationCode,
          TrnspName: doc.data().TrnspName,
        });
      });
    },

    async getPaymentGroups(requestData) {
      this.paymentgroups = [];
      let querySnapshot = await this.getDataFromFirebase(requestData, "OCTG");

      querySnapshot.forEach((doc) => {
        this.paymentgroups.push({
          PaymentGroupCode: doc.data().PaymentGroupCode,
          PymntGroup: doc.data().PymntGroup,
        });
      });
    },

    async getDataFromFirebase(requestData, tableName) {
      if (requestData) {
        return await getDocs(collection(db, tableName));
      } else {
        return await getDocsFromCache(collection(db, tableName));
      }
    },

    editQuote(item) {
      router.push({
        name: "quotesId",
        params: {
          id: item.Id,
        },
      });
    },

    viewQuote(item) {
      router.push({
        name: "quotesIdView",
        params: {
          id: item.Id,
          disabled: true,
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
            this.deleteItem(item.Id);
            this.getQuotes(true);
          }
        });
    },

    async openDialogSO(item) {
      this.quoteId = "";
      this.quoteId = item.Id;

      if (this.$refs.formDialogSO != undefined) {
        this.$refs.formDialogSO.resetValidation();
      }

      this.udfModel = {};
      this.dialogSO = true;
    },

    async createSalesOrder() {
      if (this.$refs.formDialogSO.validate()) {
        this.$swal
          .fire({
            title:
              "¿Está Seguro de convertir esta cotización a Orden de Venta?",
            text: "¡No será posible revertir el cambio!",
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "blue",
            confirmButtonText: "¡Si!",
            cancelButtonText: "Cancelar",
          })
          .then((result) => {
            if (result.value) {
              let item = {
                IsSalesOrder: true,
                Address2: this.udfModel.Address2,
                Indicator: this.udfModel.Indicator,
                PaymentGroupCode: this.udfModel.PaymentGroupCode,
                SalesPersonCode: this.udfModel.SalesPersonCode,
                TransportationCode: this.udfModel.TransportationCode,
                U_PagoVirtual: this.udfModel.U_PagoVirtual,
              };

              if (this.udfModel.U_PagoVirtual === "SI") {
                item.U_FechadeVencimientoTC =
                  this.udfModel.U_FechadeVencimientoTC;
                item.U_MedioDepago = this.udfModel.U_MedioDepago;
                item.U_NombreTC = this.udfModel.U_NombreTC;
                item.U_NombredelBanco = this.udfModel.U_NombredelBanco;
                item.U_TipoDeModena = this.udfModel.U_TipoDeModena;
                item.U_TipodeTC = this.udfModel.U_TipodeTC;
              }
              let q;
              q = doc(quotationRef, this.quoteId);
              updateDoc(q, item)
                .then(() => {
                  this.dialogSO = false;
                  this.getQuotes(true);
                  this.displayNotification(
                    "success",
                    "Se realizó la operación correctamente."
                  );
                })
                .catch(function (error) {
                  this.displayNotification("error", error.message);
                });
            }
          });
      }
    },

    async deleteItem(Id) {
      await deleteDoc(doc(db, "OQUT", Id));
    },
  },
};
</script>
