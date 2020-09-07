<template>
  <v-dialog v-model="openDialog" :width="width" persistent>
    <v-card>
      <v-card-text class="mt-5">
        <v-row align="center" justify="center" align-content="center">
          <v-row v-if="notInPaymentMode">
            <v-col align-self="center" cols="12">
              <h5 class="mt-5 mb-5 text-center text-h6 primary--text">
                HOW WOULD YOU LIKE TO PAY?
              </h5>
            </v-col>
            <v-col align-self="center" cols="12" class="mt-3 text-center">
              <v-btn
                color="primary"
                elevation="2"
                text
                rounded
                small
                @click="paymentMode('card')"
                >DEBIT/CREDIT CARD</v-btn
              >
            </v-col>
            <v-col align-self="center" cols="12" class="mt-3 text-center">
              <v-btn
                color="primary"
                elevation="2"
                text
                rounded
                small
                @click="paymentMode('cash')"
                >CASH PAYMENT</v-btn
              >
            </v-col>
          </v-row>
          <v-row v-else-if="cashPaymentMode">
            <v-col align-self="center" cols="12">
              <h5 class="mt-5 mb-5 text-center text-h6 primary--text">
                CASH PAYMENT MODE
              </h5>
            </v-col>
            <v-col>
              <v-row>
                <v-col align-self="center" cols="12" class="mt-3 text-center">
                  <v-btn
                    color="primary"
                    elevation="2"
                    small
                    :loading="cashPaymentLoading"
                    @click="makeCashPayment"
                    >CONTINUE</v-btn
                  >
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row v-else-if="cardPaymentMode">
            <v-col align-self="center" cols="12">
              <h5 class="mt-5 text-center text-h6 primary--text">
                CARD PAYMENT MODE
              </h5>
            </v-col>
            <v-col align-self="center" cols="12">
              <v-img
                src="/credit_card.png"
                width="260"
                height="153"
                class="mx-auto'"
              />
            </v-col>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="card.number"
                  :rules="cardRules.number"
                  label="Credit card number"
                  type="number"
                  required
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="card.monthYear"
                  :rules="cardRules.monthYear"
                  label="MM/YY"
                  required
                >
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="card.cvv"
                  :rules="cardRules.cvv"
                  label="CVV"
                  required
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="card.nameOnCard"
                  :rules="cardRules.nameOnCard"
                  label="Name on card"
                  required
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col align-self="center" cols="12" class="mt-3 text-center">
                <v-btn
                  color="primary"
                  elevation="2"
                  small
                  :loading="cardPaymentLoading"
                  @click="makeCardPayment"
                  >CONTINUE</v-btn
                >
              </v-col>
            </v-row>
          </v-row>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="red acent-3" @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    openDialog: {
      type: Boolean,
      default: false,
    },
    clientData: {
      type: Object,
      default: () => {},
    },
    snipData: {
      type: Object,
      default: () => {},
    },
    width: {
      type: Number,
      default: 300,
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      socket: null,
      paymentType: null,
      notInPaymentMode: true,
      cardPaymentMode: false,
      cashPaymentMode: false,
      cashPaymentLoading: false,
      cardPaymentLoading: false,
      card: {
        number: null,
        monthYear: null,
        cvv: null,
        nameOnCard: null,
      },
      cardRules: {
        number: [(v) => /^\d{16}$/.test(v) || 'Invalid Credit Card Number'],
        monthYear: [
          (v) => /^\d{2}\/\d{2}$/.test(v) || 'Invalid Month/Year supplied',
        ],
        cvv: [(v) => /^\d{3}$/.test(v) || 'Invalid CVV number supplied'],
        nameOnCard: [(v) => /^\w{7,}$/.test(v) || 'Please enter a valid name'],
      },
    }
  },
  computed: {},
  mounted() {
    this.socket = this.$nuxtSocket({
      name: 'main',
      persist: 'true',
    })
  },
  methods: {
    closeDialog() {
      this.$emit('closePaymentModeViewDialog')
    },
    makeCashPayment() {
      // eslint-disable-next-line no-console
      console.log('Make Cash Payment')
      this.closeDialog()
    },
    makeCardPayment() {
      // eslint-disable-next-line no-console
      console.log('Make Card Payment')
      this.closeDialog()
    },
    paymentMode(mode) {
      this.notInPaymentMode = false
      if (mode === 'cash') {
        this.cashPaymentMode = true
      } else if (mode === 'card') {
        this.cardPaymentMode = true
      } else {
        this.$store.dispatch('snackalert/showSnackbar', {
          msg: 'Uknown Payment Mode Chosen',
          color: 'red',
        })
      }
    },
  },
}
</script>

<style scoped></style>
