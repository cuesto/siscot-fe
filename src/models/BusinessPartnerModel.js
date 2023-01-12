class BusinessPartnerModel {
    constructor() {
        this.CardCode = "";
        this.CardName = "jhonc";
        this.Phone1= "8096019002";
        this.EmailAddress = "j@mail.com";
        this.CardType = "cLid";
        this.U_Tipo_NCF = "CONSUMF";
        this.U_Tipo_ID = "1";
        this.SalesPersonCode = 1;
        this.Indicator= "01";
        this.FederalTaxID = "40237723255";
        
        this.AddressName = "Casa";
        this.AdresType = "bo_BillTo";
        this.City = "Santo Domingo";
        this.Street = "Nuñez";
        this.Block="Castellana";
        
        this.IsTranfered = false;
        this.Log="";


        this.CreatedBy = "";
        this.ModifiedBy = "";
        this.Created = "";
        this.Modified = "";



    }
}

export default BusinessPartnerModel;
