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
                    v-model="invoiceDraftModel.cardCode"
                    :items="businessPartners"
                    :rules="[rules.required]"
                    color="blue-grey lighten-2"
                    label="Socio de Negocios"
                    item-text="displayAutoComplete"
                    item-value="cardCode"
                    hint="CardCode - CardName"
                    :loading="loadingBP"
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs1 md3></v-flex>
                <v-flex xs12 md3>
                  <v-menu
                    v-model="menuDocDueDate"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="invoiceDraftModel.docDueDate"
                        label="Fecha de contabilización"
                        prepend-icon="event"
                        readonly
                        :rules="[rules.required]"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="invoiceDraftModel.docDueDate"
                      @input="menuDocDueDate = false"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>

                <v-flex xs12 md5>
                  <v-autocomplete
                    undefined
                    v-model="invoiceDraftModel.ncfType"
                    :items="ncfTypes"
                    :rules="[rules.required]"
                    color="blue-grey lighten-2"
                    label="Tipo NCF"
                    item-text="displayAutoComplete"
                    item-value="code"
                    hint="Código - Nombre"
                    :loading="loadingNCFTypes"
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs1 md3
                  ><v-autocomplete
                    undefined
                    v-model="Currency"
                    :items="rates"
                    color="blue-grey lighten-2"
                    label="Moneda Extranjera"
                    item-text="displayAutoComplete"
                    item-value="currency"
                    hint="Moneda - Tasa"
                    :loading="loadingRates"
                  ></v-autocomplete
                ></v-flex>
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
                        v-model="invoiceDraftModel.docDate"
                        label="Fecha de documento"
                        prepend-icon="event"
                        readonly
                        :rules="[rules.required]"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="invoiceDraftModel.docDate"
                      @input="menuDocDate = false"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 md12>
                  <v-data-table
                    :headers="headers"
                    :search="search"
                    :items="invoiceDraftModel.invoiceDraftDetail"
                    sort-by="itemcode"
                    class="elevation-1"
                  >
                    <template v-slot:top>
                      <v-toolbar flat color="white">
                        <v-toolbar-title>Factura Draft</v-toolbar-title>
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
                              <v-icon left dark>add</v-icon>
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
                                  <v-row>
                                    <v-col cols="12" sm="6" md="12">
                                      <v-autocomplete
                                        v-model="ItemCode"
                                        :items="items"
                                        :rules="[rules.required]"
                                        color="blue-grey lighten-2"
                                        label="Artículo"
                                        item-text="displayAutoComplete"
                                        item-value="itemCode"
                                        hint="Código - Artículo"
                                        :loading="loadingItems"
                                      ></v-autocomplete>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col cols="5" sm="5" md="5">
                                      <v-text-field
                                        label="Precio"
                                        :rules="[rules.required]"
                                        v-model="invoiceDraftDetailModel.Price"
                                      ></v-text-field>
                                    </v-col>
                                    <v-col cols="2" sm="2" md="2">
                                      <v-text-field
                                        label="Desc. %"
                                        v-model="
                                          invoiceDraftDetailModel.Discount
                                        "
                                      ></v-text-field>
                                    </v-col>
                                    <v-col cols="5" sm="5" md="5">
                                      <v-text-field
                                        label="Cantidad"
                                        :rules="[rules.required]"
                                        v-model="invoiceDraftDetailModel.Qty"
                                      ></v-text-field>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col cols="6" sm="6" md="6">
                                      <v-autocomplete
                                        v-model="
                                          invoiceDraftDetailModel.WhsCode
                                        "
                                        :items="warehouses"
                                        :rules="[rules.required]"
                                        color="blue-grey lighten-2"
                                        label="Almacén"
                                        item-text="displayAutoComplete"
                                        item-value="whsCode"
                                        hint="Código - Almacén"
                                        :loading="loadingWhs"
                                      ></v-autocomplete>
                                    </v-col>
                                    <v-col cols="6" sm="6" md="6">
                                      <v-autocomplete
                                        v-model="
                                          invoiceDraftDetailModel.TaxCode
                                        "
                                        :items="taxes"
                                        :rules="[rules.required]"
                                        color="blue-grey lighten-2"
                                        label="Impuesto"
                                        item-text="displayAutoComplete"
                                        item-value="code"
                                        hint="Impuesto"
                                        :loading="loadingTaxes"
                                      ></v-autocomplete>
                                    </v-col>
                                  </v-row>
                                </v-container>
                                <small>*indica campo requerido.</small>
                              </v-card-text>
                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                  color="blue darken-1"
                                  text
                                  @click="dialog = false"
                                  >Cerrar</v-btn
                                >
                                <v-btn
                                  color="blue darken-1"
                                  text
                                  @click="addItem"
                                  >Guardar</v-btn
                                >
                              </v-card-actions>
                            </v-card>
                          </v-form>
                        </v-dialog>
                      </v-toolbar>
                    </template>
                    <template #[`item.actions`]="{ item }" v-if="!disabled">
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
                    <template v-slot:no-data>
                      <v-btn color="primary">
                        <v-icon left dark>autorenew</v-icon>Refrescar
                      </v-btn>
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
                          v-model="invoiceDraftModel.comments"
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
                          label="Subtotal"
                          v-model="invoiceDraftModel.subTotal"
                        ></v-text-field>
                        <v-text-field
                          disabled
                          label="Impuestos"
                          v-model="invoiceDraftModel.tax"
                        ></v-text-field>
                        <v-text-field
                          disabled
                          label="Total"
                          v-model="invoiceDraftModel.total"
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
import axios from "axios";
import { mask } from "vue-the-mask";
import router from "../router";
import InvoiceDraftModel from "../models/InvoiceDraftModel";
import InvoiceDraftDetailModel from "../models/InvoiceDraftDetailModel";

export default {
  directives: {
    mask,
  },
  data() {
    return {
      loadingBP: false,
      loadingWhs: false,
      loadingItems: false,
      loadingTaxes: false,
      loadingNCFTypes: false,
      loadingRates: false,
      search: "",
      menuDocDueDate: false,
      menuDocDate: false,
      menuDispatchDate: false,
      users: [],
      warehouses: [],
      businessPartners: [],
      items: [],
      headers: [
        { text: "Número de Artículo", sortable: true, value: "itemCode" },
        { text: "Descripción", sortable: true, value: "itemName" },
        { text: "Precio", sortable: false, value: "price" },
        { text: "Cantidad", sortable: false, value: "qty" },
        { text: "Impuesto", sortable: false, value: "taxCode" },
        { text: "Desc. %", sortable: false, value: "discount" },
        { text: "Total", sortable: false, value: "total" },
        { text: "Opciones", value: "options", sortable: false },
      ],
      taxes: [],
      ncfTypes: [],
      rates: [],
      dialog: false,
      maskQty: "###########",
      rules: {
        required: (value) => !!value || "Requerido.",
        email: (value) => {
          const pattern = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
          return pattern.test(value) || "Correo Inválido.";
        },
      },
      invoiceDraftModel: new InvoiceDraftModel(),
      invoiceDraftDetailModel: new InvoiceDraftDetailModel(),
      //whsCode: undefined,
      editedIndex: -1,
      ItemCode: "",
      disabled: false,
      Currency: "",
      Rate: 1,
    };
  },
  created() {
    // this.getBusinessPartners();
    // this.getWarehousesByUser();
    // this.loadInvoiceDraftEdit();
    // this.getNCFTypes();
    // this.getRates();
    // this.getItems();
    // this.getTaxes();
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
        this.invoiceDraftDetailModel.ItemCode = newValue;
        this.setPrice();
      },
    },
    Currency: {
      handler: function (newValue) {
        this.invoiceDraftModel.currency = newValue;
        let rate = this.rates.find(
          (element) => element.currency === this.invoiceDraftModel.currency
        );
        this.invoiceDraftModel.rate = rate.rate;
      },
    },
  },
  methods: {
    setPrice() {
      let item = this.items.find(
        (element) => element.itemCode === this.invoiceDraftDetailModel.ItemCode
      );

      if (this.invoiceDraftModel.currency != "") {
        this.invoiceDraftDetailModel.Price = (
          item.price / this.invoiceDraftModel.rate
        ).toFixed(2);
      } else {
        this.invoiceDraftDetailModel.Price = item.price;
      }
    },

    loadInvoiceDraftEdit() {
      this.id = this.$route.params.id;
      if (this.id != undefined) {
        this.getInvoiceDraftEdit();
      }
      let disable = this.$route.params.disabled;
      if (disable != undefined) {
        this.disabled = disable;
      }
    },

    async getInvoiceDraftEdit() {
      let me = this;
      await axios
        .get("api/InvoiceDrafts/GetInvoiceDraftByKey/" + this.id)
        .then(function (response) {
          me.invoiceDraftModel = response.data;
          me.Currency = me.invoiceDraftModel.currency;
        })
        .catch(function (error) {
          me.displayNotification("error", error.message);
        });
    },

    async getBusinessPartners() {
      let me = this;
      me.loadingBP = true;
      await axios
        .get(
          "api/BusinessPartners/GetBusinessPartners/" +
            me.$store.state.user.company
        )
        .then(function (response) {
          me.businessPartners = response.data;
          me.loadingBP = false;
        })
        .catch(function (error) {
          me.displayNotification("error", error.message);
        });
    },
    async getWarehousesByUser() {
      let me = this;
      me.loadingWhs = true;
      await axios
        .get(
          "api/Warehouses/GetWarehousesByUser/" +
            me.$store.state.user.company +
            "/" +
            me.$store.state.user.userkey
        )
        .then(function (response) {
          me.warehouses = response.data;
          me.loadingWhs = false;
        })
        .catch(function (error) {
          me.displayNotification("error", error.message);
        });
    },
    async getItems() {
      let me = this;
      me.loadingItems = true;
      await axios
        .get("api/Items/GetItemsByCompany/" + me.$store.state.user.company)
        .then(function (response) {
          me.items = response.data;
          me.loadingItems = false;
        })
        .catch(function (error) {
          me.displayNotification("error", error.message);
        });
    },
    async getTaxes() {
      let me = this;
      me.loadingTaxes = true;
      await axios
        .get("api/Taxes/GetTaxesByCompany/" + me.$store.state.user.company)
        .then(function (response) {
          me.taxes = response.data;
          me.loadingTaxes = false;
        })
        .catch(function (error) {
          me.displayNotification("error", error.message);
        });
    },
    async getNCFTypes() {
      let me = this;
      me.loadingNCFTypes = true;
      await axios
        .get(
          "api/NCFTypes/GetNCFTypesByCompany/" + me.$store.state.user.company
        )
        .then(function (response) {
          me.ncfTypes = response.data;
          me.loadingNCFTypes = false;
        })
        .catch(function (error) {
          me.displayNotification("error", error.message);
        });
    },
    async getRates() {
      let me = this;
      me.loadingRates = true;
      await axios
        .get("api/Rates/GetRatesByCompany/" + me.$store.state.user.company)
        .then(function (response) {
          me.rates = response.data;
          me.loadingRates = false;
        })
        .catch(function (error) {
          me.displayNotification("error", error.message);
        });
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
    addItem() {
      let item = this.items.find(
        (element) => element.itemCode === this.invoiceDraftDetailModel.ItemCode
      );

      let tax = this.taxes.find(
        (element) => element.code === this.invoiceDraftDetailModel.TaxCode
      );

      let itemToAdd = {};

      itemToAdd.itemCode = this.invoiceDraftDetailModel.ItemCode;
      itemToAdd.itemName = item.itemName;
      itemToAdd.whsCode = this.invoiceDraftDetailModel.WhsCode;
      itemToAdd.price = this.invoiceDraftDetailModel.Price;
      itemToAdd.qty = this.invoiceDraftDetailModel.Qty;
      itemToAdd.discount = this.invoiceDraftDetailModel.Discount;
      itemToAdd.taxCode = this.invoiceDraftDetailModel.TaxCode;
      itemToAdd.invoiceDraftDetailKey = this.invoiceDraftDetailModel.InvoiceDraftDetailKey;
      itemToAdd.invoiceDraftKey = this.invoiceDraftModel.invoiceDraftKey;

      //Calulate Total Line
      if (itemToAdd.discount != undefined || itemToAdd.discount > 0) {
        itemToAdd.total = itemToAdd.price * itemToAdd.qty;
        itemToAdd.total =
          itemToAdd.total - itemToAdd.total * (itemToAdd.discount / 100);
      } else {
        itemToAdd.total = itemToAdd.price * itemToAdd.qty;
      }

      //Calculate Tax Line
      itemToAdd.tax = itemToAdd.total * (tax.rate / 100);

      if (this.editedIndex > -1) {
        let editedItem = {
          ...this.invoiceDraftModel.invoiceDraftDetail[this.editedIndex],
          ...itemToAdd,
        };
        this.invoiceDraftModel.invoiceDraftDetail.splice(
          this.editedIndex,
          1,
          editedItem
        );
      } else {
        this.invoiceDraftModel.invoiceDraftDetail.push(itemToAdd);
      }

      this.cleanTotals();
      this.calculateTotals();

      this.closeDialog();
    },

    cleanTotals() {
      this.invoiceDraftModel.subTotal = 0;
      this.invoiceDraftModel.tax = 0;
      this.invoiceDraftModel.total = 0;
    },

    calculateTotals() {
      this.invoiceDraftModel.subTotal = this.invoiceDraftModel.invoiceDraftDetail.reduce(
        (accum, item) => accum + item.total,
        0
      );

      this.invoiceDraftModel.tax = this.invoiceDraftModel.invoiceDraftDetail.reduce(
        (accum, item) => accum + item.tax,
        0
      );

      this.invoiceDraftModel.total =
        this.invoiceDraftModel.subTotal + this.invoiceDraftModel.tax;

      this.invoiceDraftModel.tax = this.invoiceDraftModel.tax.toFixed(2);
      this.invoiceDraftModel.total = this.invoiceDraftModel.total.toFixed(2);
    },

    editItem(item) {
      this.editedIndex = this.invoiceDraftModel.invoiceDraftDetail.indexOf(
        item
      );

      this.invoiceDraftDetailModel = new InvoiceDraftDetailModel();

      this.invoiceDraftDetailModel.InvoiceDraftDetailKey =
        item.invoiceDraftDetailKey;
      this.invoiceDraftDetailModel.InvoiceDraftKey = this.invoiceDraftModel.invoiceDraftKey;
      this.ItemCode = item.itemCode;
      this.invoiceDraftDetailModel.ItemCode = item.itemCode;
      this.invoiceDraftDetailModel.ItemName = item.itemName;
      this.invoiceDraftDetailModel.WhsCode = item.whsCode;
      this.invoiceDraftDetailModel.Qty = item.qty;
      this.invoiceDraftDetailModel.Price = item.price;
      this.invoiceDraftDetailModel.TaxCode = item.taxCode;
      this.invoiceDraftDetailModel.Discount = item.discount;

      this.dialog = true;
    },

    deleteItem(item) {
      let deletedIndex = this.invoiceDraftModel.invoiceDraftDetail.indexOf(
        item
      );
      this.invoiceDraftModel.invoiceDraftDetail.splice(deletedIndex, 1);
      this.cleanTotals();
      this.calculateTotals();
    },

    async save() {
      if (this.$refs.form.validate()) {
        let me = this;
        me.invoiceDraftModel.CreatedBy = this.$store.state.user.name;
        me.invoiceDraftModel.companyKey = me.$store.state.user.company;

        if (me.invoiceDraftModel.cardCode != "") {
          me.invoiceDraftModel.cardName = me.businessPartners.find(
            (x) => x.cardCode == me.invoiceDraftModel.cardCode
          ).cardName;
        }
        await axios
          .post(
            "api/InvoiceDrafts/PostInvoiceDraft",
            me.invoiceDraftModel,
            me.invoiceDraftModel.invoiceDraftDetail
          )
          .then(function (response) {
            if (response.data.result == "ERROR") {
              me.displayNotification("error", response.data.message);
            } else {
              if (me.invoiceDraftModel.invoiceDraftKey > 0) {
                router.push({ name: "home" });
              }
              me.close();
              me.clean();
              me.displayNotification(
                "success",
                "Se realizó la operación correctamente."
              );
            }
          })
          .catch(function (error) {
            me.displayNotification("error", error.message);
          });
      }
    },
    closeDialog() {
      this.dialog = false;
      setTimeout(() => {
        this.invoiceDraftDetailModel = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.ItemCode = "";
      }, 300);
    },
    close() {
      setTimeout(() => {
        this.invoiceDraftModel = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    clean() {
      this.invoiceDraftModel = new InvoiceDraftModel();
    },
  },
};
</script>  
