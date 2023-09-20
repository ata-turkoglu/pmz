<template>
    <div class="addProduct">
        <div class="addProduct_header">
            <span> Üretim </span>
            <v-icon
                icon="mdi-plus-circle-outline"
                color="#0d47a1"
                class="ml-3"
                @click="openDialog()"
            />
            <v-dialog
                v-model="dialogState"
                min-width="200"
                max-width="500"
                persistent
            >
                <v-card variant="outlined" style="background-color: white">
                    <v-card-item class="p-5" title="Ürün Ekle">
                        <v-select
                            class="mt-3"
                            label="Ürün"
                            :items="productOptions"
                            variant="outlined"
                            v-model="formData.product"
                        ></v-select>
                        <v-select
                            label="Boyut"
                            :items="sizeOptions"
                            variant="outlined"
                            v-model="formData.size"
                            item-title="product_size"
                            item-value="id"
                            :disabled="formData.product == null"
                        ></v-select>
                        <v-select
                            label="Paket"
                            :items="packageOptions"
                            variant="outlined"
                            v-model="formData.package"
                            item-title="package_name"
                            item-value="id"
                        ></v-select>
                        <v-text-field
                            ref="amountField"
                            label="Miktar"
                            variant="outlined"
                            type="number"
                            v-model="formData.amount"
                            :rules="[checkAmount]"
                            :min="1"
                        ></v-text-field>
                    </v-card-item>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="dialogState = false">Kapat</v-btn>
                        <v-btn
                            @click="addProduct()"
                            variant="outlined"
                            :disabled="!checkFrom"
                        >
                            Ekle
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
        <div class="addProduct_content">
            <span
                class="addProduct_content_item"
                v-for="(item, index) in items"
                :key="index"
            >
                <b>{{ item.amount }}</b
                >&nbsp adet &nbsp <b>{{ getProductDefinition(item.size) }}</b
                >&nbsp
                {{ getPackaging(item.package) }}
                <v-icon
                    icon="mdi-minus-circle-outline"
                    color="#0d47a1"
                    class="ml-1"
                    size="small"
                    @click="deleteProduct(index)"
                />
            </span>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
export default {
    props: ["receivedProduced"],
    setup(props) {
        const store = useStore();

        const amountField = ref(null);
        let dialogState = ref(false);

        const formData = ref({
            product: null,
            size: null,
            package: null,
            amount: null,
        });

        const formValidation = ref({
            product: true,
            size: true,
            package: true,
            amount: true,
        });

        const openDialog = () => {
            formData.value = {
                product: null,
                size: null,
                package: null,
                amount: null,
            };
            dialogState.value = true;
        };

        const items = ref([]);
        const checkFrom = computed(() => {
            let state = true;
            Object.values(formData.value).forEach((item) => {
                if (item == null) {
                    state = false;
                }
            });
            Object.values(formValidation.value).forEach((item) => {
                if (!item) {
                    state = false;
                }
            });
            return state;
        });
        const addProduct = () => {
            formData.value.amount = Number(formData.value.amount);
            items.value.push(formData.value);
            dialogState.value = false;
        };

        const checkAmount = (val) => {
            if (val == "" || val == null) {
                formValidation.value.amount = false;
                return "Boş olamaz";
            }
            if (!Number(val)) {
                formValidation.value.amount = false;
                return "Yanlış giriş";
            }
            if (Number(val) < 1) {
                formValidation.value.amount = false;
                return "Sıfırdan büyük olmalı";
            }
            formValidation.value.amount = true;
            return true;
        };

        const productOptions = computed(() => {
            return [
                ...new Set(
                    store.state.dbProducts
                        .filter((item) => item.facility == 2)
                        .map((item) => item.product)
                ),
            ];
        });

        const sizeOptions = computed(() => {
            return store.state.dbProducts.filter(
                (item) =>
                    item.facility == 2 && item.product == formData.value.product
            );
        });

        const packageOptions = computed(() => {
            return store.state.dbProductPackagings.filter(
                (item) => item.facility == 2
            );
        });

        const getProductDefinition = (id) => {
            return store.state.dbProducts.find((itm) => itm.id == id)
                .definition;
        };

        const getPackaging = (id) => {
            return store.state.dbProductPackagings.find((itm) => itm.id == id)
                .package_name;
        };

        const getProductGroup = (id) => {
            return store.state.dbProducts.find((itm) => itm.id == id).product;
        };

        const deleteProduct = (index) => {
            items.value.splice(index, 1);
        };

        onMounted(() => {
            if (props.receivedProduced != null) {
                props.receivedProduced.forEach((itm) => {
                    items.value.push({
                        product: getProductGroup(itm.product),
                        size: itm.product,
                        package: itm.package,
                        amount: itm.amount,
                    });
                });
            }
        });

        return {
            dialogState,
            amountField,
            formData,
            items,
            productOptions,
            sizeOptions,
            packageOptions,
            getProductDefinition,
            getPackaging,
            openDialog,
            addProduct,
            deleteProduct,
            checkAmount,
            checkFrom,
        };
    },
};
</script>

<style lang="scss" scoped>
.addProduct {
    width: 100%;
    height: 100%;
    min-height: 150px;
    border: 1px solid rgb(180, 180, 180);
    &_header {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        color: grey;
        padding: 1rem 0 1rem 1rem;
    }
    &_content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        padding: 0 0 1rem 1rem;
        font-size: 0.9rem;
        span {
            display: flex;
            align-items: center;
            align-content: center;
            justify-content: flex-start;
            padding-block: 0.2rem;
        }
    }
}

@media screen and (max-width: 600px) {
    .addProduct_content {
        font-size: 0.9rem;
        padding: 0 0 1rem 0.5rem;
        span {
            padding-block: 0.5rem;
        }
    }
}
</style>
