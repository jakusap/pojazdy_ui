const getters = {
  device: (state) => state.app.device,
  instance: (state) => state.app.instance,
  settlementPeriods: (state) => state.periods.settlementPeriods,
  selectedSettlementPeriodCode: (state) => state.periods.selectedSettlementPeriodCode,
  settlementsSchemas: (state) => state.schemas.schemas,
  dataLoading: (state) => state.app.dataLoading,
  partnerUuid: (state, getters) => {
    const partnerProfile = getters['partnerProfile/profileInfo'];
    const driverInfo = getters['driverAccount/getLoggedDriverInfo'];
    if (partnerProfile && partnerProfile.uuid) {
      return partnerProfile.uuid;
    }
    return driverInfo?.partnerUuid;
  },
  partnerCode: (state, getters) => {
    const partnerProfile = getters['partnerProfile/profileInfo'];
    const partners = getters['partners/getPartnersList'];
    if (partnerProfile && partnerProfile.code) {
      return partnerProfile.code;
    }
    return partners.find((partner) => partner.uuid == getters.partnerUuid)?.code;
  },
};
export default getters;
