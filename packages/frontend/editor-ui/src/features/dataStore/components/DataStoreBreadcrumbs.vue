<script setup lang="ts">
import { computed } from 'vue';
import type { DataStoreEntity } from '../datastore.types';
import { useI18n } from '@n8n/i18n';
import type { Project } from '@/types/projects.types';
import type { PathItem } from '@n8n/design-system/components/N8nBreadcrumbs/Breadcrumbs.vue';
import { useRouter } from 'vue-router';

const BREADCRUMBS_SEPARATOR = '›';

type Props = {
	dataStore: DataStoreEntity;
};

const props = defineProps<Props>();

const i18n = useI18n();
const router = useRouter();

const project = computed(() => {
	return props.dataStore.project ?? null;
});

const breadcrumbs = computed<PathItem[]>(() => {
	if (!project.value) {
		return [];
	}
	return [
		{
			id: 'datastores',
			label: i18n.baseText('dataStore.dataStores'),
			href: `/projects/${project.value.id}/datastores`,
		},
		{
			id: String(props.dataStore.id),
			label: props.dataStore.name,
		},
	];
});

const onItemClicked = async (item: PathItem) => {
	if (item.href) {
		await router.push(item.href);
	}
};
</script>

<template>
	<n8n-breadcrumbs
		:items="breadcrumbs"
		:separator="BREADCRUMBS_SEPARATOR"
		@item-selected="onItemClicked"
	>
		<template #prepend>
			<project-breadcrumb :current-project="project as Project" />
		</template>
	</n8n-breadcrumbs>
</template>
