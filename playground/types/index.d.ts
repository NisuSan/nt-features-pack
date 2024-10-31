export {}

declare global {
  namespace PrismaJson {
    type BankInfo = { name: string, city: string, address: string, mfo: string, edrpou: string }
    type DistrictInfo = { name: string, subItem?: Array<{ id: number, name: string }> }
    type AddressInfo = { postal_code: number, region: string, city: string, district_id?: number, street: string, house: string, flat: string, phone: string, email: string }
    type ClientGeneralInfo = {
      name: string,
      address: AddressInfo,
      kind: 'Government' | 'Private' | 'Company' | 'Unknown',
      tax_number: string,
      edrpou: string,
    }
    type ClientProfitInfo = { non_profit: boolean, fine: boolean, bankrupt: boolean }
    type ClientContacts = {
      ceo: { position: string, first_name: string, last_name: string, middle_name: string, phone: string, email: string },
      chief_accountant: { first_name: string, last_name: string, middle_name: string, phone: string, email: string }
    }
    type ContractDates = { from: string, to: string }
    type ContractServiceInfo = { max_day_for_bill: number, days_for_payment: number }
    type ContractRequisites = { bank_id: number, current_account: number }
    type ContractConfidant = { first_name: string, last_name: string, middle_name: string, phone: string, email: string }
    type AccountAdditionalInfo = { district_id: number, village_group: boolean, bill_bank_id: number }
  }
}
