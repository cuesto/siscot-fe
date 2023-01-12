class BusinessPartnerModel {
    constructor() {
        this.CardCode = "";
        this.CardName = "";
        this.Phone1= "";
        this.EmailAddress = "";
        this.CardType = "cLid";
        this.U_Tipo_NCF = "CONSUMF";
        this.U_Tipo_ID = "1";
        this.SalesPersonCode = 1;
        this.Indicator= "01";
        this.FederalTaxID = "";
        
        this.AddressName = "";
        this.AdresType = "bo_BillTo";
        this.City = "";
        this.Street = "";
        this.Block="";
        
        this.IsTranfered = false;
        this.Log="";


        this.CreatedBy = "";
        this.ModifiedBy = "";
        this.Created = "";
        this.Modified = "";



    }
}

export default BusinessPartnerModel;
