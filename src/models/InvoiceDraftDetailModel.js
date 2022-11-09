class InvoiceDraftDetailModel {
  constructor() {
    this.InvoiceDraftDetailKey = 0;
    this.InvoiceDraftKey = 0;
    this.ItemCode = "";
    this.ItemName = "";
    this.WhsCode = "";
    this.Qty = 1;
    this.Price = 1;
    this.Discount = 0;
    this.TaxCode = "";
    this.Tax = 0;
    this.Total = 0;
  }
}

export default InvoiceDraftDetailModel;
