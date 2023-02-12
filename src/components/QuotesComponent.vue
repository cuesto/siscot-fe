<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex xs12 md12>
        <v-card title="Cotización" elevation="0" :disabled="disabled">
          <v-form ref="form">
            <v-container py-0>
              <v-layout wrap>
                <v-flex xs12 md5>
                  <v-autocomplete
                    v-model="quotationModel.CardCode"
                    :items="businessPartners"
                    :rules="[rules.required]"
                    color="blue-grey lighten-2"
                    label="Socio de Negocios"
                    item-text="displayAutoComplete"
                    item-value="CardCode"
                    hint="Código - Nombre - RNC/Cédula"
                    :loading="loadingBP"
                  ></v-autocomplete>
                  <v-dialog v-model="dialogbp" persistent max-width="600px">
                    <template v-slot:activator="{ on }">
                      <v-btn color="primary" dark v-on="on" v-if="!disabled">
                        <v-icon left dark>mdi-account-plus</v-icon>Agregar
                        Cliente
                      </v-btn>
                    </template>
                    <v-form ref="formDialogBP">
                      <v-card>
                        <v-card-title>
                          <span class="headline">Agregar Cliente</span>
                        </v-card-title>
                        <v-card-text>
                          <v-container>
                            <v-row>
                              <v-col cols="7" sm="6" md="6">
                                <v-text-field
                                  label="Nombre"
                                  :rules="[rules.required]"
                                  v-model="bpModel.CardName"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="5" sm="6" md="6">
                                <v-select
                                  :loading="loadingNCFTypes"
                                  undefined
                                  v-model="bpModel.U_Tipo_NCF"
                                  :items="ncfTypes"
                                  item-text="Name"
                                  item-value="Code"
                                  :rules="[rules.required]"
                                  color="blue-grey lighten-2"
                                  label="Tipo NCF"
                                ></v-select>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="6" sm="6" md="6">
                                <v-text-field
                                  label="Email"
                                  :rules="[rules.required, rules.email]"
                                  v-model="bpModel.EmailAddress"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="6" sm="6" md="6">
                                <v-text-field
                                  label="Celular"
                                  :rules="[rules.required]"
                                  v-model="bpModel.Phone1"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="6" sm="6" md="6">
                                <v-select
                                  undefined
                                  v-model="bpModel.U_Tipo_ID"
                                  :items="idTypes"
                                  item-text="Name"
                                  item-value="Code"
                                  :rules="[rules.required]"
                                  color="blue-grey lighten-2"
                                  label="Tipo ID"
                                ></v-select>
                              </v-col>
                              <v-col cols="6" sm="6" md="6">
                                <v-text-field
                                  label="RNC/Cédula"
                                  :rules="[rules.required]"
                                  v-model="bpModel.FederalTaxID"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="6" sm="6" md="6">
                                <v-select
                                  undefined
                                  v-model="bpModel.Indicator"
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
                                  v-model="bpModel.SalesPersonCode"
                                  :items="salesPersons"
                                  item-text="SlpName"
                                  item-value="SlpCode"
                                  :rules="[rules.required]"
                                  color="blue-grey lighten-2"
                                  label="Vendedor"
                                ></v-select>
                              </v-col>
                            </v-row>
                            <v-divider></v-divider>
                            <v-row>
                              <v-col cols="12" sm="12" md="12">
                                <v-text-field
                                  label="Dirección"
                                  :rules="[rules.required]"
                                  v-model="bpModel.AddressName"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12" sm="12" md="12">
                                <v-text-field
                                  label="Calle"
                                  :rules="[rules.required]"
                                  v-model="bpModel.Street"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="6" sm="6" md="6">
                                <v-text-field
                                  label="Ciudad"
                                  :rules="[rules.required]"
                                  v-model="bpModel.City"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="6" sm="6" md="6">
                                <v-text-field
                                  label="Sector"
                                  :rules="[rules.required]"
                                  v-model="bpModel.Block"
                                ></v-text-field>
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
                            @click="closeDialog()"
                            >Cerrar</v-btn
                          >
                          <v-btn color="blue darken-1" text @click="addBP"
                            >Agregar</v-btn
                          >
                        </v-card-actions>
                      </v-card>
                    </v-form>
                  </v-dialog>
                </v-flex>
                <v-flex xs1 md3></v-flex>
                <v-flex xs12 md3>
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
                        v-model="quotationModel.DocDate"
                        label="Fecha de documento"
                        prepend-icon="event"
                        readonly
                        :rules="[rules.required]"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="quotationModel.DocDate"
                      @input="menuDocDate = false"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 md12>
                  <v-data-table
                    :headers="headers"
                    :search="search"
                    :items="quotationModel.DocumentLines"
                    class="elevation-1"
                  >
                    <template v-slot:top>
                      <v-toolbar flat color="white">
                        <v-toolbar-title>Cotización</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-text-field
                          v-if="!disabled"
                          class="text-xs-center"
                          v-model="search"
                          append-icon="search"
                          label="Búsqueda"
                          single-line
                          hide-details
                        ></v-text-field>
                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" persistent max-width="600px">
                          <template v-slot:activator="{ on }">
                            <v-btn
                              color="green"
                              dark
                              v-on="on"
                              v-if="!disabled"
                            >
                              <v-icon left dark
                                >mdi-package-variant-closed-plus</v-icon
                              >
                              {{ formTitle }}
                            </v-btn>
                          </template>
                          <v-form ref="formDialog">
                            <v-card>
                              <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                              </v-card-title>
                              <v-card-text>
                                <v-container>
                                  <v-row justify="end" align="center">
                                    <v-col cols="8" sm="5" md="8">
                                      <v-autocomplete
                                        v-model="ItemCode"
                                        :items="items"
                                        :rules="[rules.required]"
                                        color="blue-grey lighten-2"
                                        label="Artículo"
                                        item-text="displayAutoComplete"
                                        item-value="ItemCode"
                                        hint="Código - Artículo"
                                        :loading="loadingItems"
                                      ></v-autocomplete>
                                    </v-col>
                                    <v-col cols="4" sm="1" md="4">
                                      <v-dialog
                                        v-model="dialogqr"
                                        max-width="600px"
                                      >
                                        <template v-slot:activator="{ on }">
                                          <v-btn color="blue" dark v-on="on">
                                            <v-icon left dark
                                              >mdi-qrcode-scan</v-icon
                                            >Escanear
                                          </v-btn>
                                        </template>
                                        <v-card>
                                          <v-card-title>
                                            <span class="headline"
                                              >Escanear Código</span
                                            >
                                          </v-card-title>
                                          <v-card-text v-if="dialogqr">
                                            <StreamBarcodeReader
                                              @decode="
                                                (a, b, c) => onDecode(a, b, c)
                                              "
                                              @loaded="() => onLoaded()"
                                            ></StreamBarcodeReader>
                                          </v-card-text>
                                        </v-card>
                                      </v-dialog>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col cols="5" sm="5" md="5">
                                      <v-text-field
                                        label="Precio"
                                        prefix="RD$"
                                        type="number"
                                        :rules="[
                                          rules.required,
                                          rules.positivevalue,
                                        ]"
                                        v-model="quotationDetailModel.UnitPrice"
                                      ></v-text-field>
                                    </v-col>
                                    <v-col cols="5" sm="5" md="5">
                                      <v-text-field
                                        label="Cantidad"
                                        type="number"
                                        :rules="[
                                          rules.required,
                                          rules.positivevalue,
                                        ]"
                                        v-model="quotationDetailModel.Quantity"
                                      ></v-text-field>
                                    </v-col>
                                    <v-col cols="2" sm="2" md="2">
                                      <v-text-field
                                        label="Desc."
                                        suffix="%"
                                        :rules="[rules.positivevalue]"
                                        type="number"
                                        v-model="
                                          quotationDetailModel.DiscountPercent
                                        "
                                      ></v-text-field>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col cols="6" sm="6" md="6">
                                      <v-select
                                        undefined
                                        v-model="quotationDetailModel.WarehouseCode"
                                        :items="warehouses"
                                        item-text="WhsName"
                                        item-value="WhsCode"
                                        :rules="[rules.required]"
                                        color="blue-grey lighten-2"
                                        label="Almacén"
                                      ></v-select>
                                    </v-col>
                                    <v-col cols="6" sm="6" md="6">
                                      <v-select
                                        undefined
                                        v-model="quotationDetailModel.TaxCode"
                                        :items="taxes"
                                        item-text="displayAutoComplete"
                                        item-value="Code"
                                        :rules="[rules.required]"
                                        color="blue-grey lighten-2"
                                        label="Impuesto"
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
                                  @click="closeDialog()"
                                  >Cerrar</v-btn
                                >
                                <v-btn
                                  color="blue darken-1"
                                  text
                                  @click="addItem"
                                  >Agregar</v-btn
                                >
                              </v-card-actions>
                            </v-card>
                          </v-form>
                        </v-dialog>
                      </v-toolbar>
                    </template>
                    <template #[`item.options`]="{ item }" v-if="!disabled">
                      <v-icon
                        size="sm"
                        variant="outline-info"
                        color="blue"
                        class="mr-1"
                        @click="editItem(item)"
                        >edit</v-icon
                      >
                      <v-icon
                        size="sm"
                        color="red"
                        class="mr-1"
                        @click="deleteItem(item)"
                        >delete</v-icon
                      >
                    </template>
                  </v-data-table>
                </v-flex>
                <v-container>
                  <v-row no-gutters>
                    <v-col cols="12" sm="6">
                      <v-container fluid>
                        <v-textarea
                          counter
                          solo
                          label="Comentarios"
                          v-model="quotationModel.Comments"
                        ></v-textarea>
                      </v-container>
                    </v-col>
                    <v-col cols="12" sm="2">
                      <v-card elevation="0"></v-card>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-card class="pa-2" outlined tile>
                        <v-text-field
                          disabled
                          prefix="RD$"
                          label="Subtotal"
                          v-model="quotationModel.SubTotal"
                        ></v-text-field>
                        <v-text-field
                          disabled
                          prefix="RD$"
                          label="Impuestos"
                          v-model="quotationModel.Tax"
                        ></v-text-field>
                        <v-text-field
                          disabled
                          prefix="RD$"
                          label="Total"
                          v-model="quotationModel.Total"
                        ></v-text-field>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>

                <v-flex xs12 text-xs-right>
                  <v-row v-if="disabled">
                    <v-col cols="12" sm="6" md="3">
                      <v-text-field label="Firma" value=" "></v-text-field>
                    </v-col>
                  </v-row>
                  <v-btn
                    class="mx-0 font-weight-light"
                    color="success"
                    @click="save"
                    v-if="!disabled"
                  >
                    <v-icon left>save</v-icon>Guardar
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card>
      </v-flex>
      <v-flex xs12 md4></v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import router from "../router";
import { mask } from "vue-the-mask";
import QuotationModel from "../models/QuotationModel";
import QuotationDetailModel from "../models/QuotationDetailModel";
import BusinessPartnerModel from "../models/BusinessPartnerModel";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseApp } from "../../firebase";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  getDocsFromCache,
  setDoc,
  collection,
} from "firebase/firestore";
import { StreamBarcodeReader } from "vue-barcode-reader";

const auth = getAuth();
const db = getFirestore(firebaseApp);
const quotationRef = collection(db, "OQUT");
const businessPartnerRef = collection(db, "OCRD");

export default {
  directives: {
    mask,
  },
  components: {
    StreamBarcodeReader,
  },
  data() {
    return {
      Id: "",
      ItemCode: "",
      businessPartners: [],
      items: [],
      taxes: [],
      warehouses:[],
      ncfTypes: [],
      idTypes: [],
      indicators: [],
      salesPersons: [],

      loadingBP: false,
      loadingItems: false,
      menuDocDate: false,
      dialog: true,
      dialogqr: false,
      dialogbp: false,

      quotationModel: new QuotationModel(),
      quotationDetailModel: new QuotationDetailModel(),
      bpModel: new BusinessPartnerModel(),

      loadingWhs: false,
      loadingTaxes: false,
      loadingNCFTypes: false,
      loadingRates: false,
      search: "",

      headers: [
        {
          text: "Número de Artículo",
          sortable: true,
          value: "ItemCode",
        },
        {
          text: "Descripción",
          sortable: true,
          value: "ItemName",
        },
        {
          text: "Precio",
          sortable: false,
          value: "UnitPrice",
        },
        {
          text: "Cantidad",
          sortable: false,
          value: "Quantity",
        },
        {
          text: "Almacén",
          sortable: false,
          value: "WarehouseCode",
        },
        {
          text: "Impuesto",
          sortable: false,
          value: "TaxCode",
        },
        {
          text: "Desc. %",
          sortable: false,
          value: "DiscountPercent",
        },
        {
          text: "Total",
          sortable: false,
          value: "Total",
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
      editedIndex: -1,

      disabled: false,
      // Currency: "",
      // Rate: 1,
      // company: "",
    };
  },
  created() {
    this.getBusinessPartners();
    this.getItems();
    this.getTaxes();
    this.getWarehouses();
    this.getNCFTypes();
    this.getIDTypes();
    this.getIndicators();
    this.getSalesPersons();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.getUserData(user.uid);
      }
    });

    this.loadQuote();
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Agregar Artículo"
        : "Actualizar Artículo";
    },
  },
  watch: {
    dialog(val) {
      val || this.closeDialog();
      if (this.$refs.formDialog != undefined)
        this.$refs.formDialog.resetValidation();
    },
    ItemCode: {
      handler: function (newValue) {
        if (newValue == "" || newValue == undefined) return;
        this.quotationDetailModel.ItemCode = newValue;
        this.setPrice();
      },
    },
  },
  methods: {
    async loadQuote() {
      this.Id = this.$route.params.id;
      if (this.Id != undefined) {
        const docRef = doc(db, "OQUT", this.Id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          this.quotationModel = docSnap.data();
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }
      let disable = this.$route.params.disabled;
      if (disable != undefined) {
        this.disabled = disable;
      }
    },

    async getUserData(uid) {
      const userRef = doc(db, "profiles", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        this.url = userSnap.data().server;
      } else {
        console.log("No such document!");
      }
    },

    async getBusinessPartners() {
      this.loadingBP = true;
      this.businessPartners = [];
      let querySnapshot;

      //querySnapshot = await getDocs(collection(db, "OCRD"));
      querySnapshot = await getDocsFromCache(collection(db, "OCRD"));
      querySnapshot.forEach((doc) => {
        this.businessPartners.push({
          CardCode: doc.data().CardCode,
          CardName: doc.data().CardName,
          Phone1: doc.data().Phone1,
          SalesPersonCode: doc.data().SalesPersonCode,
          FederalTaxID: doc.data().FederalTaxID,
          U_Tipo_NCF: doc.data().U_Tipo_NCF,
          displayAutoComplete:
            doc.data().CardCode +
            " - " +
            doc.data().CardName +
            " - " +
            doc.data().FederalTaxID,
        });
      });
      this.loadingBP = false;
    },

    async getItems() {
      this.loadingItems = true;
      this.items = [];
      let querySnapshot;
      //querySnapshot = await getDocs(collection(db, "OITM"));
      querySnapshot = await getDocsFromCache(collection(db, "OITM"));

      querySnapshot.forEach((doc) => {
        this.items.push({
          ItemCode: doc.data().ItemCode,
          ItemName: doc.data().ItemName,
          ItmsGrpNam: doc.data().ItmsGrpNam,
          UnitPrice: doc.data().Price.toFixed(2),
          Quantity: doc.data().Quantity,
          displayAutoComplete:
            doc.data().ItemCode + " - " + doc.data().ItemName,
        });
      });
      this.loadingItems = false;
    },

    async getTaxes() {
      let me = this;
      me.loadingTaxes = true;
      let querySnapshot;
      //querySnapshot = await getDocs(collection(db, "OSTA"));
      querySnapshot = await getDocsFromCache(collection(db, "OSTA"));

      querySnapshot.forEach((doc) => {
        this.taxes.push({
          Code: doc.data().Code,
          Name: doc.data().Name,
          Rate: doc.data().Rate,
          displayAutoComplete: doc.data().Code + " - " + doc.data().Rate + "%",
        });
      });
      this.loadingTaxes = false;
    },

    async getWarehouses() {
      let querySnapshot;
      //querySnapshot = await getDocs(collection(db, "OWHS"));
      querySnapshot = await getDocsFromCache(collection(db, "OWHS"));

      querySnapshot.forEach((doc) => {
        this.warehouses.push({
          WhsCode: doc.data().WhsCode,
          WhsName: doc.data().WhsName,
          Locked: doc.data().Locked,
          displayAutoComplete: doc.data().Code + " - " + doc.data().Rate + "%",
        });
      });
      console.log(this.warehouses);
    },

    async getNCFTypes() {
      this.loadingNCFTypes = true;
      this.ncfTypes = [];
      let querySnapshot;
      //querySnapshot = await getDocs(collection(db, "TIPONCF"));
      querySnapshot = await getDocsFromCache(collection(db, "TIPONCF"));
      querySnapshot.forEach((doc) => {
        this.ncfTypes.push({
          Code: doc.data().Code,
          Name: doc.data().Name,
        });
      });
      this.loadingNCFTypes = false;
    },

    async getIDTypes() {
      this.idTypes = [];
      let querySnapshot;
      //querySnapshot = await getDocs(collection(db, "TIPOID"));
      querySnapshot = await getDocsFromCache(collection(db, "TIPOID"));
      querySnapshot.forEach((doc) => {
        this.idTypes.push({
          Code: doc.data().Code,
          Name: doc.data().Name,
        });
      });
    },

    async getIndicators() {
      this.indicators = [];
      let querySnapshot;
      //querySnapshot = await getDocs(collection(db, "OIDC"));
      querySnapshot = await getDocsFromCache(collection(db, "OIDC"));
      querySnapshot.forEach((doc) => {
        this.indicators.push({
          Code:
            doc.data().Code < 10 ? "0" + doc.data().Code : "" + doc.data().Code,
          Name: doc.data().Name,
        });
      });
    },

    async getSalesPersons() {
      this.salesPersons = [];
      let querySnapshot;
      //querySnapshot = await getDocs(collection(db, "OSLP"));
      querySnapshot = await getDocsFromCache(collection(db, "OSLP"));
      querySnapshot.forEach((doc) => {
        this.salesPersons.push({
          SlpCode: doc.data().SlpCode,
          SlpName: doc.data().SlpName,
        });
      });
    },

    setPrice() {
      let item = this.items.find(
        (element) => element.ItemCode === this.quotationDetailModel.ItemCode
      );
      this.quotationDetailModel.UnitPrice = item.UnitPrice;
    },

    addItem() {
      if (this.$refs.formDialog.validate()) {
        let item = this.items.find(
          (element) => element.ItemCode === this.quotationDetailModel.ItemCode
        );

        let tax = this.taxes.find(
          (element) => element.Code === this.quotationDetailModel.TaxCode
        );

        let itemToAdd = {};

        itemToAdd.ItemCode = this.quotationDetailModel.ItemCode;
        itemToAdd.ItemName = item.ItemName;
        itemToAdd.UnitPrice = this.quotationDetailModel.UnitPrice;
        itemToAdd.Quantity = this.quotationDetailModel.Quantity;
        itemToAdd.DiscountPercent = this.quotationDetailModel.DiscountPercent;
        itemToAdd.TaxCode = this.quotationDetailModel.TaxCode;

        //Calulate Total Line
        if (
          itemToAdd.DiscountPercent != undefined ||
          itemToAdd.DiscountPercent > 0
        ) {
          itemToAdd.Total = itemToAdd.UnitPrice * itemToAdd.Quantity;
          itemToAdd.Total =
            itemToAdd.Total -
            itemToAdd.Total * (itemToAdd.DiscountPercent / 100);
        } else {
          itemToAdd.Total = itemToAdd.UnitPrice * itemToAdd.Quantity;
        }

        //Calculate Tax Line
        itemToAdd.Tax = itemToAdd.Total * (tax.Rate / 100);

        if (this.editedIndex > -1) {
          let editedItem = {
            ...this.quotationModel.DocumentLines[this.editedIndex],
            ...itemToAdd,
          };
          this.quotationModel.DocumentLines.splice(
            this.editedIndex,
            1,
            editedItem
          );
        } else {
          this.quotationModel.DocumentLines.push(itemToAdd);
        }

        this.cleanTotals();
        this.calculateTotals();

        this.closeDialog();
      }
    },

    addBP() {
      if (this.$refs.formDialogBP.validate()) {
        let bp = this.businessPartners.find(
          (x) => x.FederalTaxID == this.bpModel.FederalTaxID
        );

        if (bp != undefined) {
          this.displayNotification(
            "warning",
            "Existe un socio con el mismo RNC/Cédula"
          );
        } else {
          const crypto = window.crypto || window.msCrypto;
          let array = new Uint32Array(1);

          this.bpModel.CardCode = "" + crypto.getRandomValues(array)[0];

          setDoc(
            doc(businessPartnerRef),
            JSON.parse(JSON.stringify(this.bpModel))
          )
            .then(() => {
              this.closeDialog();
              this.quotationModel.CardCode = this.bpModel.CardCode;
              this.getBusinessPartners();
              this.displayNotification(
                "success",
                "Se realizó la operación correctamente."
              );
            })
            .catch(function (error) {
              this.displayNotification("error", error.message);
            });
        }
      }
    },

    cleanTotals() {
      this.quotationModel.SubTotal = 0;
      this.quotationModel.Tax = 0;
      this.quotationModel.Total = 0;
    },

    calculateTotals() {
      this.quotationModel.SubTotal = this.quotationModel.DocumentLines.reduce(
        (accum, item) => accum + item.Total,
        0
      );

      this.quotationModel.Tax = this.quotationModel.DocumentLines.reduce(
        (accum, item) => accum + item.Tax,
        0
      );

      this.quotationModel.Total =
        this.quotationModel.SubTotal + this.quotationModel.Tax;

      this.quotationModel.SubTotal = Number(
        this.quotationModel.SubTotal
      ).toFixed(2);
      this.quotationModel.Tax = Number(this.quotationModel.Tax).toFixed(2);
      this.quotationModel.Total = Number(this.quotationModel.Total).toFixed(2);
    },

    deleteItem(item) {
      let deletedIndex = this.quotationModel.DocumentLines.indexOf(item);
      this.quotationModel.DocumentLines.splice(deletedIndex, 1);
      this.cleanTotals();
      this.calculateTotals();
    },

    editItem(item) {
      this.editedIndex = this.quotationModel.DocumentLines.indexOf(item);

      this.quotationDetailModel = new QuotationDetailModel();

      this.ItemCode = item.ItemCode;
      this.quotationDetailModel.ItemCode = item.ItemCode;
      this.quotationDetailModel.ItemName = item.ItemName;
      this.quotationDetailModel.Quantity = item.Quantity;
      this.quotationDetailModel.UnitPrice = item.UnitPrice;
      this.quotationDetailModel.TaxCode = item.TaxCode;
      this.quotationDetailModel.DiscountPercent = item.DiscountPercent;

      this.dialog = true;
    },

    onDecode(a, b, c) {
      this.ItemCode = a;
      this.dialogqr = false;
      if (this.id) clearTimeout(this.id);
      this.id = setTimeout(() => {
        if (this.ItemCode === a) {
          this.ItemCode = "";
        }
      }, 5000);
    },

    onLoaded() {},

    async save() {
      if (this.$refs.form.validate()) {
        let bp = this.businessPartners.find(
          (x) => x.CardCode == this.quotationModel.CardCode
        );

        this.quotationModel.CardName = bp.CardName;
        this.quotationModel.U_TelCliente = bp.Phone1;
        this.quotationModel.SalesPersonCode = bp.SalesPersonCode;
        this.quotationModel.U_Tipo_NCF = bp.U_Tipo_NCF;
        this.quotationModel.U_RNC_Ced = bp.FederalTaxID;

        let q;

        if (this.Id == "" || this.Id == undefined) {
          q = doc(quotationRef);
        } else {
          q = doc(quotationRef, this.Id);
        }

        setDoc(q, JSON.parse(JSON.stringify(this.quotationModel)))
          .then(() => {
            this.close();
            this.displayNotification(
              "success",
              "Se realizó la operación correctamente."
            );
            router.push({
              name: "dashboard",
            });
          })
          .catch(function (error) {
            this.displayNotification("error", error.message);
          });
      }
    },

    closeDialog() {
      setTimeout(() => {
        if (this.dialog || this.dialogqr) {
          this.dialog = false;
          this.dialogqr = false;
          this.quotationDetailModel = new QuotationDetailModel();
          this.$refs.formDialog.resetValidation();
          this.editedIndex = -1;
          this.ItemCode = "";
        } else if (this.dialogbp) {
          this.dialogbp = false;
          this.bpModel = new BusinessPartnerModel();
          this.$refs.formDialogBP.resetValidation();
        }
      }, 300);
    },

    close() {
      setTimeout(() => {
        this.quotationModel = new QuotationModel();
        this.$refs.form.resetValidation();
        this.editedIndex = -1;
      }, 300);
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
  },
};
</script>
