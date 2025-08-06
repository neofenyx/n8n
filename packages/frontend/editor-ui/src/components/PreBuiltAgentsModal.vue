<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from '@n8n/i18n';
import { PRE_BUILT_AGENTS_MODAL_KEY } from '@/constants';
import { createEventBus } from '@n8n/utils/event-bus';
import { useTelemetry } from '@/composables/useTelemetry';
import { getPrebuiltAgents } from '@/utils/templates/workflowSamples';
import { useCalloutHelpers } from '@/composables/useCalloutHelpers';
import ItemsRenderer from './Node/NodeCreator/Renderers/ItemsRenderer.vue';
import type { INodeCreateElement, OpenTemplateElement } from '@/Interface';

const i18n = useI18n();
const modalBus = createEventBus();
const telemetry = useTelemetry();
const { openSampleWorkflowTemplateById } = useCalloutHelpers();

const templates = getPrebuiltAgents();
const elements = computed(() =>
	templates.map(
		(template) =>
			({
				key: template.meta.templateId,
				type: 'openTemplate',
				properties: {
					templateId: template.meta.templateId,
					title: template.name ?? 'title',
					description: 'foobar',
					icon: 'bell',
					tag: undefined,
				},
			}) satisfies OpenTemplateElement,
	),
);

function onSelected(item: INodeCreateElement) {
	if (item.type === 'openTemplate') {
		if (item.properties.templateId === 'rag-starter-template') {
			telemetry.track('User clicked on RAG callout', {
				node_type: null,
			});
		}
		openSampleWorkflowTemplateById(item.properties.templateId);
	}
}
</script>

<template>
	<Modal
		:name="PRE_BUILT_AGENTS_MODAL_KEY"
		:title="i18n.baseText('preBuiltAgentsModal.title')"
		:center="true"
		width="520"
		:event-bus="modalBus"
	>
		<template #content>
			<ItemsRenderer :elements="elements" @selected="onSelected">
				<template #default> </template>
				<template #empty>
					<slot name="empty" v-bind="{ elements }" />
				</template>
			</ItemsRenderer>
		</template>
	</Modal>
</template>

<style lang="scss" module>
.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: var(--border-base);
	padding-bottom: var(--spacing-s);
}

:global(.el-dialog__header) {
	padding-bottom: var(--spacing-s);
}

.column {
	display: flex;
	flex-direction: column;
	gap: var(--spacing-2xs);
}

.row {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: var(--spacing-2xs);
}

.container {
	margin-bottom: var(--spacing-l);
}

.article {
	padding: var(--spacing-s) 0;
}

.markdown {
	margin: var(--spacing-s) 0;

	p,
	strong,
	em,
	s,
	code,
	a,
	li {
		font-size: var(--font-size-s);
	}

	hr {
		margin-bottom: var(--spacing-s);
	}
}
</style>
