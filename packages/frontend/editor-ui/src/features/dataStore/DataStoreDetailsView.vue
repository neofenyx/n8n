<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { DataStoreEntity } from '@/features/dataStore/datastore.types';
import { useDataStoreStore } from './dataStore.store';
import { useToast } from '@/composables/useToast';
import { useI18n } from '@n8n/i18n';

type Props = {
	id: string;
	projectId: string;
};

const props = defineProps<Props>();

const toast = useToast();
const i18n = useI18n();

const dataStoreStore = useDataStoreStore();

const loading = ref(false);
const dataStore = ref<DataStoreEntity | null>(null);

const initialize = async () => {
	loading.value = true;
	try {
		const response = await dataStoreStore.fetchOrFindDataStore(props.id, props.projectId);
		if (response) {
			dataStore.value = response;
		} else {
			toast.showError(
				new Error(i18n.baseText('dataStore.notFound')),
				i18n.baseText('dataStore.getDetails.error'),
			);
		}
	} catch (error) {
		toast.showError(error, i18n.baseText('dataStore.getDetails.error'));
	} finally {
		loading.value = false;
	}
};

onMounted(async () => {
	await initialize();
});
</script>

<template>
	<div :class="$style['data-store-details-view']">
		<div v-if="loading" class="loading">
			<n8n-loading
				variant="h1"
				:loading="true"
				:rows="1"
				:shrink-last="false"
				:class="$style['header-loading']"
			/>
			<n8n-loading :loading="true" variant="h1" :rows="10" :shrink-last="false" />
		</div>
		<div v-else-if="dataStore">
			<h1>{{ dataStore.name }}</h1>
		</div>
	</div>
</template>

<style lang="scss" module>
.data-store-details-view {
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
	max-width: var(--content-container-width);
	box-sizing: border-box;
	align-content: start;
	padding: var(--spacing-l) var(--spacing-2xl) 0;
}

.header-loading {
	margin-bottom: var(--spacing-xl);

	div {
		height: 2em;
	}
}
</style>
