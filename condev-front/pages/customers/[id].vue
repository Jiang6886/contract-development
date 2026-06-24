<script setup lang="ts">
type CustomerDetail = {
  id: string
  companyName: string
  companyNameKana: string | null
  representativeName: string
  postalCode: string | null
  address: string
  buildingName: string | null
  phoneNumber: string
  faxNumber: string | null
  siteUrl: string | null
  importance: string | null
  contractConclusionDate: string | null
  primarySales: string | null
  secondarySales: string | null
  remarks: string | null
  registeredBy: string
  registeredAt: string
  updatedBy: string
  updatedAt: string
}

type PostalCodeSearchResponse = {
  postalCode: string
  address: string | null
}

const { $api } = useNuxtApp()
const route = useRoute()

definePageMeta({
  layout: 'authenticated'
})

const customer = ref<CustomerDetail | null>(null)
const form = reactive({
  companyName: '',
  companyNameKana: '',
  representativeName: '',
  postalCode: '',
  address: '',
  buildingName: '',
  phoneNumber: '',
  faxNumber: '',
  siteUrl: '',
  importance: '',
  contractConclusionDate: '',
  primarySales: '',
  secondarySales: '',
  remarks: ''
})
const loading = ref(true)
const saving = ref(false)
const searchingPostalCode = ref(false)
const editing = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const pageTitle = computed(() => editing.value ? '顧客編集' : '顧客参照')
const pageDescription = computed(() =>
  editing.value ? '顧客の詳細情報を編集できます。' : '顧客の詳細情報を確認できます。'
)

const formatDateTime = (value: string | null | undefined) => {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))
}

const formatDate = (value: string | null | undefined) => {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(value))
}

const syncForm = (detail: CustomerDetail) => {
  form.companyName = detail.companyName
  form.companyNameKana = detail.companyNameKana || ''
  form.representativeName = detail.representativeName
  form.postalCode = detail.postalCode || ''
  form.address = detail.address
  form.buildingName = detail.buildingName || ''
  form.phoneNumber = detail.phoneNumber
  form.faxNumber = detail.faxNumber || ''
  form.siteUrl = detail.siteUrl || ''
  form.importance = detail.importance || ''
  form.contractConclusionDate = detail.contractConclusionDate || ''
  form.primarySales = detail.primarySales || ''
  form.secondarySales = detail.secondarySales || ''
  form.remarks = detail.remarks || ''
}

const fetchCustomer = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const { data } = await $api.get<CustomerDetail>(`/customers/${route.params.id}`)
    customer.value = data
    syncForm(data)
  } catch {
    errorMessage.value = '顧客情報の取得に失敗しました。'
  } finally {
    loading.value = false
  }
}

const startEdit = () => {
  if (!customer.value) {
    return
  }

  syncForm(customer.value)
  successMessage.value = ''
  errorMessage.value = ''
  editing.value = true
}

const cancelEdit = () => {
  if (customer.value) {
    syncForm(customer.value)
  }

  editing.value = false
  errorMessage.value = ''
}

const searchAddressByPostalCode = async () => {
  if (!editing.value || searchingPostalCode.value) {
    return
  }

  const normalizedPostalCode = form.postalCode.replace(/\D/g, '')
  if (normalizedPostalCode.length !== 7) {
    return
  }

  searchingPostalCode.value = true
  errorMessage.value = ''

  try {
    const { data } = await $api.get<PostalCodeSearchResponse>('/customers/postal-code/search', {
      params: {
        postalCode: form.postalCode
      }
    })

    form.postalCode = data.postalCode
    if (data.address) {
      form.address = data.address
    } else {
      errorMessage.value = '郵便番号に該当する住所が見つかりませんでした。'
    }
  } catch {
    errorMessage.value = '住所の自動取得に失敗しました。手入力してください。'
  } finally {
    searchingPostalCode.value = false
  }
}

const saveCustomer = async () => {
  saving.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const { data } = await $api.patch<CustomerDetail>(`/customers/${route.params.id}`, {
      ...form,
      companyNameKana: form.companyNameKana || null,
      postalCode: form.postalCode || null,
      buildingName: form.buildingName || null,
      faxNumber: form.faxNumber || null,
      siteUrl: form.siteUrl || null,
      importance: form.importance || null,
      contractConclusionDate: form.contractConclusionDate || null,
      primarySales: form.primarySales || null,
      secondarySales: form.secondarySales || null,
      remarks: form.remarks || null
    })
    customer.value = data
    syncForm(data)
    editing.value = false
    successMessage.value = '顧客情報を更新しました。'
  } catch {
    errorMessage.value = '顧客情報の更新に失敗しました。入力内容を確認してください。'
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await fetchCustomer()
})
</script>

<template>
  <div class="customer-page">
    <div class="d-flex align-center justify-space-between mb-5">
      <div>
        <h1 class="text-h5 font-weight-bold mb-1">{{ pageTitle }}</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">{{ pageDescription }}</p>
      </div>
      <div class="d-flex ga-2">
        <v-btn prepend-icon="mdi-arrow-left" variant="outlined" to="/customers">一覧へ戻る</v-btn>
        <v-btn
          v-if="!editing"
          color="primary"
          prepend-icon="mdi-pencil"
          :disabled="!customer"
          @click="startEdit"
        >
          編集
        </v-btn>
        <template v-else>
          <v-btn prepend-icon="mdi-close" variant="outlined" :disabled="saving" @click="cancelEdit">
            キャンセル
          </v-btn>
          <v-btn color="primary" prepend-icon="mdi-content-save" :loading="saving" @click="saveCustomer">
            保存
          </v-btn>
        </template>
      </div>
    </div>

    <v-alert
      v-if="successMessage"
      class="mb-5"
      density="comfortable"
      type="success"
      variant="tonal"
    >
      {{ successMessage }}
    </v-alert>

    <v-alert
      v-if="errorMessage"
      class="mb-5"
      density="comfortable"
      type="error"
      variant="tonal"
    >
      {{ errorMessage }}
    </v-alert>

    <v-card class="customer-detail-card pa-5 pa-md-6">
      <v-progress-linear v-if="loading" class="mb-5" color="primary" indeterminate />

      <template v-if="customer">
        <v-row dense>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.companyName"
              class="customer-detail-field"
              label="企業名"
              :readonly="!editing"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.companyNameKana"
              class="customer-detail-field"
              label="企業名かな"
              :readonly="!editing"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.representativeName"
              class="customer-detail-field"
              label="法人代表"
              :readonly="!editing"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.postalCode"
              class="customer-detail-field"
              :append-inner-icon="editing ? 'mdi-map-search-outline' : undefined"
              label="郵便番号"
              :loading="searchingPostalCode"
              :readonly="!editing"
              @blur="searchAddressByPostalCode"
              @click:append-inner="searchAddressByPostalCode"
            />
          </v-col>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="form.address"
              class="customer-detail-field"
              label="住所"
              :readonly="!editing"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="form.buildingName"
              class="customer-detail-field"
              label="ビル名"
              :readonly="!editing"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.phoneNumber"
              class="customer-detail-field"
              label="電話番号"
              :readonly="!editing"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.faxNumber"
              class="customer-detail-field"
              label="FAX番号"
              :readonly="!editing"
            />
          </v-col>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="form.siteUrl"
              class="customer-detail-field"
              label="サイトURL"
              :readonly="!editing"
            />
          </v-col>
          <v-col class="d-flex align-center pb-5" cols="12" md="4">
            <v-btn
              v-if="customer.siteUrl"
              append-icon="mdi-open-in-new"
              color="primary"
              :href="customer.siteUrl"
              rel="noopener noreferrer"
              target="_blank"
              variant="text"
            >
              サイトを開く
            </v-btn>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="form.importance"
              class="customer-detail-field"
              clearable
              :items="['高', '中', '低']"
              label="重要度"
              :readonly="!editing"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-if="editing"
              v-model="form.contractConclusionDate"
              class="customer-detail-field"
              label="契約締結日"
              type="date"
            />
            <v-text-field
              v-else
              class="customer-detail-field"
              label="契約締結日"
              :model-value="formatDate(customer.contractConclusionDate)"
              readonly
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="form.primarySales"
              class="customer-detail-field"
              label="自社担当営業（主担当）"
              :readonly="!editing"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="form.secondarySales"
              class="customer-detail-field"
              label="自社担当営業（副担当）"
              :readonly="!editing"
            />
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="form.remarks"
              auto-grow
              class="customer-detail-field"
              label="備考"
              :readonly="!editing"
              rows="3"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              class="customer-detail-field customer-detail-field--readonly"
              label="登録者"
              :model-value="customer.registeredBy"
              readonly
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              class="customer-detail-field customer-detail-field--readonly"
              label="登録日時"
              :model-value="formatDateTime(customer.registeredAt)"
              readonly
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              class="customer-detail-field customer-detail-field--readonly"
              label="更新者"
              :model-value="customer.updatedBy"
              readonly
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              class="customer-detail-field customer-detail-field--readonly"
              label="更新日時"
              :model-value="formatDateTime(customer.updatedAt)"
              readonly
            />
          </v-col>
        </v-row>

        <div v-if="editing" class="customer-detail-actions mt-4">
          <v-btn prepend-icon="mdi-close" variant="outlined" :disabled="saving" @click="cancelEdit">
            キャンセル
          </v-btn>
          <v-btn color="primary" prepend-icon="mdi-content-save" :loading="saving" @click="saveCustomer">
            保存
          </v-btn>
        </div>
      </template>
    </v-card>
  </div>
</template>
