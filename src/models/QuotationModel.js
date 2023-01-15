class QuotationModel {
    constructor() {
        this.CardCode = "";
        this.CardName = "";
        this.DocDate = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
        this.Comments = "";
        this.U_Tipo_NCF = "CONSUMF";
        this.U_TelCliente = "";
        this.SalesPersonCode = 1;
        this.U_RNC_Ced = "";
        this.DocEntry = "";
        this.DocNum = "";
        this.SubTotal = 0;
        this.Tax = 0;
        this.Total = 0;
        this.DocumentLines = [];
        this.IsTransfered = false;
        this.Log="";


        this.CreatedBy = "";
        this.ModifiedBy = "";
        this.Created = "";
        this.Modified = "";



    }
}

export default QuotationModel;
