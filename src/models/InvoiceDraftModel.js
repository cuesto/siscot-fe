class InvoiceDraftModel {
  constructor() {
    this.invoiceDraftKey = 0;
    this.cardCode = "";
    this.cardName = "";
    this.customerDisplay = "";
    this.whsCode = "1";
    this.whsName = "";
    this.whsDisplay = "";
    this.docDueDate = "";
    this.docDate = "";
    this.companyKey = 0;
    this.comments = "";
    this.currency = "";
    this.rate = 0;

    this.ncfType = "";

    this.subTotal = 0;
    this.tax = 0;
    this.discount = 0;
    this.total = 0;

    this.invoiceDraftDetail = [];

    this.CreatedBy = "";
    this.ModifiedBy = "";
    this.Created = "";
    this.Modified = "";



  }
}

export default InvoiceDraftModel;
