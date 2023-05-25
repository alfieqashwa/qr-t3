// import { PROVINCES } from "../src/constants/provinces"
// import { REGENCIES } from "../src/constants/regencies"
// import { DISTRICTS } from "../src/constants/districts"
// import { VILLAGES } from "../src/constants/villages"

import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
async function main() {
  /*
  !============ ATTENTION ===============
  * Instead of using third-api, it's a good idea to store the addresses into its own database
  * Comment-out to store address when setup or do migration into new database
  * `pnpm dlx prisma db seed` OR `pnpm db:seed`
*/

  /* //!================== PROVINCES ====================== */
  // const provinces = await prisma.province.createMany({ data: PROVINCES })
  // console.log({ provinces })

  /* //!================== REGENCIES ====================== */
  // const getRegencies = REGENCIES.map((r) => ({ id: r.id, provinceId: r.province_id, name: r.name }))
  // const regencies = await prisma.regency.createMany({ data: getRegencies })
  // console.log({ regencies })

  /* //!================== DISTRICTS ====================== */
  // const getDistricts = DISTRICTS.map((d) => ({ id: d.id, regencyId: d.regency_id, name: d.name }))
  // const districts = await prisma.district.createMany({ data: getDistricts })
  // console.log({ districts })

  /* //!================== VILLAGES ====================== */
  // const getVillages = VILLAGES.map((v) => ({ id: v.id, districtId: v.district_id, name: v.name }))
  // const villages = await prisma.village.createMany({ data: getVillages })
  // console.log({ villages })


  /* //!=============  FIND & CAPTURE IF THERE'RE ANY DUPLICATED ID ======================= */

  // interface Village {
  //   id: string
  //   district_id: string
  //   name: string
  // }

  // function hasDuplicateIds(array: Village[]): string[] {
  //   const ids: Set<string> = new Set()
  //   const duplicateIds: string[] = []

  //   for (const obj of array) {
  //     if (ids.has(obj.id)) {
  //       duplicateIds.push(obj.id)
  //     } else {
  //       ids.add(obj.id)
  //     }
  //   }
  //   return duplicateIds
  // }
  // console.log(hasDuplicateIds(VILLAGES)) // Output: false

}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
