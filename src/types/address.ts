export interface Province {
  id: string
  name: string
}
export interface Regency extends Province {
  province_id: string
}
export interface District extends Province {
  regency_id: string
}

export interface Village extends Province {
  district_id: string
}
