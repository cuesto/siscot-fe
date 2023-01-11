class QuotationModel {
    constructor() {
      this.QuotationKey = 0;
      this.CardCode = "";
      this.CardName = "";
      this.CustomerDisplay = "";
      this.WhsCode = "1";
      this.WhsName = "";
      this.WhsDisplay = "";
      this.DocDate = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
      this.Comments = "";
      this.Currency = "";
      this.Rate = 0;
  
      this.NCFType = "";
  
      this.SubTotal = 0;
      this.Tax = 0;
      this.Discount = 0;
      this.Total = 0;
  
      this.QuotationDetail = [];
  
      this.CreatedBy = "";
      this.ModifiedBy = "";
      this.Created = "";
      this.Modified = "";
  
  
  
    }
  }
  
  export default QuotationModel;
  