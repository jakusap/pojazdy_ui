export const ABPARTNER = 'ABPARTNER';
export const APPARTNER = 'APPARTNER';
export const AVALONCARS = 'AVALONCARS';
export const AVALONLOGISTICS = 'AVALONLOGISTICS';
export const COMFORTWAY = 'COMFORTWAY';
export const DLKOMFORT = 'DLKOMFORT';
export const PROFLEET = 'PROFLEET';
export const QUICKAPPS = 'QUICKAPPS';
export const SELECT = 'SELECT';

const referenceMap = [
  { code: ABPARTNER, id: '16b7302a-59e7-49c4-a8fc-4fd3511dd4a6' },
  { code: APPARTNER, id: 'dcebe528-a7bd-44b1-96c7-f33c7f7cd625' },
  { code: AVALONCARS, id: '691c9f7c-eb76-47b8-9724-a91736408d98' },
  { code: AVALONLOGISTICS, id: '594f3c31-e864-4f97-9d76-dfae040d36ce' },
  { code: COMFORTWAY, id: 'e779b51f-2e3a-467d-b3bd-8634c749e458' },
  { code: DLKOMFORT, id: 'e3d415b3-c6b9-4d67-80eb-4498534a197f' },
  { code: PROFLEET, id: 'b4bb1a9f-bb97-42e6-ade5-69e7da5027e5' },
  { code: QUICKAPPS, id: '5ae20b0f-e151-49d4-8865-f600c78071e2' },
  { code: SELECT, id: 'aa0179a3-a78f-4631-adee-d350af84ed54' },
];

export const referenceId2PartnerCode = (referenceId) => {
  const partner = referenceMap.find((p) => p.id == referenceId);
  return partner?.code;
};
