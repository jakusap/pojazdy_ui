import { mapActions, mapGetters } from 'vuex';

const schemasActionsMixin = {
  data() {
    return {
      messageOptions: {
        center: true,
        duration: 2000,
      },
    };
  },
  computed: {
    ...mapGetters(['settlementsSchemas']),
    ...mapGetters('schemasViewStore', [
      'editedSchema',
      'addMode',
      'editMode',
      'selectedNumber',
      'additionalCosts',
      'monthlyCosts',
      'driversList',
    ]),

    disableActions() {
      return this.addMode || this.editMode;
    },
  },
  methods: {
    ...mapActions('schemasViewStore', [
      'setEditedSchema',
      'setAddMode',
      'setEditMode',
      'setAdditionalCosts',
      'setMonthlyCosts',
      'resetSchemaNumber',
    ]),
    uploadSuccess() {
      this.$message({
        type: 'success',
        message: this.$t('Schemas.upload_success'),
        ...this.message,
      });
    },
    editSuccess() {
      this.$message({
        type: 'success',
        message: this.$t('Schemas.edit_success'),
        ...this.messageOptions,
      });
    },
    deleteSuccess() {
      this.$message({
        type: 'success',
        message: this.$t('Schemas.delete_success'),
        ...this.messageOptions,
      });
    },
    requestFailed() {
      this.$message({
        type: 'error',
        message: this.$t('Schemas.request_failed'),
        ...this.messageOptions,
      });
    },
    toggleEditedSchema() {
      if (this.addMode) {
        this.setAddMode(false);
        this.loadSchema(this.settlementsSchemas[0]);
      } else {
        this.setEditMode(!this.editMode);
        this.findSchema(this.selectedNumber);
        this.$nextTick(() => this.form.validate());
      }
    },
    resetView(deleted) {
      this.$store.dispatch('schemas/loadSchemas');
      this.setAddMode(false);
      this.setEditMode(false);
      this.setAdditionalCosts([]);
      if (deleted) {
        this.resetSchemaNumber();
      }
    },
    findSchema(selectedNumber) {
      const editedSchema = this.settlementsSchemas.find((schema) => schema.schemaNumber === selectedNumber);
      editedSchema && this.loadSchema(editedSchema);
      return;
    },
    loadSchema(schema) {
      if (schema) {
        this.selectedSchema = schema.schemaNumber;

        let parsedCosts = {};
        Object.entries(schema.maxDailySettlementCosts).map((entry, idx) => {
          parsedCosts = { ...parsedCosts, [`maxDailySettlementCosts${idx + 1}`]: Number(entry[1]).toFixed(2) };
        });

        const parsedSchema = {};

        const numberProperties = [
          'monthlyContractCosts',
          'vatSplitRate',
          'dailySettlementCost',
          'minContractIncome',
          'taxDeductionRate',
          'tripSettlementCost',
          'maxTripSettlementCost',
        ];

        const excludedProperties = ['maxDailySettlementCosts'];

        Object.entries(schema).map((entry) => {
          if (!excludedProperties.includes(entry[0])) {
            parsedSchema[entry[0]] = numberProperties.includes(entry[0]) ? Number(entry[1]).toFixed(2) : entry[1];
          }
        });

        const editedSchema = {
          ...parsedSchema,
          ...parsedCosts,
          taxDeductionRate: Number(parsedSchema.taxDeductionRate * 100).toFixed(2),
          vatSplitRate: Number(parsedSchema.vatSplitRate * 100).toFixed(2),
          payoutRate: Number(parsedSchema.payoutRate * 100).toFixed(2),
          monthlyCosts: schema.monthlyCosts.map((cost) => {
            return { ...cost, amount: cost.amount.toFixed(2) };
          }),
          additionalCosts: schema.additionalCosts.map((cost) => {
            return { ...cost, amount: cost.amount.toFixed(2) };
          }),
        };

        this.setEditedSchema(editedSchema);
      }
    },

    parseNumberString(value) {
      return parseFloat(String(value).replace(',', '.'));
    },
    parseSchemaToNumber(editedSchema) {
      const {
        dailySettlementCost,
        minContractIncome,
        taxDeductionRate,
        vatSplitRate,
        payoutRate,
        maxDailySettlementCosts1,
        maxDailySettlementCosts2,
        maxDailySettlementCosts3,
        tripSettlementCost,
        maxTripSettlementCost,
        minTransferAmount,
      } = editedSchema;

      const parsedSchema = {
        ...editedSchema,
        dailySettlementCost: this.parseNumberString(dailySettlementCost),
        minContractIncome: this.parseNumberString(minContractIncome),
        taxDeductionRate: this.parseNumberString(taxDeductionRate / 100),
        vatSplitRate: this.parseNumberString(vatSplitRate / 100),
        payoutRate: this.parseNumberString(payoutRate / 100),
        tripSettlementCost: this.parseNumberString(tripSettlementCost),
        maxTripSettlementCost: this.parseNumberString(maxTripSettlementCost),
        minTransferAmount: this.parseNumberString(minTransferAmount),
        maxDailySettlementCosts: {
          1: this.parseNumberString(maxDailySettlementCosts1),
          2: this.parseNumberString(maxDailySettlementCosts2),
          3: this.parseNumberString(maxDailySettlementCosts3),
        },
        monthlyCosts: this.monthlyCosts.map((cost) => {
          return { ...cost, amount: this.parseNumberString(cost.amount) };
        }),

        additionalCosts: this.additionalCosts.map((cost) => {
          return { ...cost, amount: this.parseNumberString(cost.amount) };
        }),
      };
      return parsedSchema;
    },
  },
};

export default schemasActionsMixin;
