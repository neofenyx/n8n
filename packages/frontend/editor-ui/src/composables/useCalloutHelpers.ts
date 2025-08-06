import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTelemetry } from '@/composables/useTelemetry';
import { useRootStore } from '@n8n/stores/useRootStore';
import { useUsersStore } from '@/stores/users.store';
import { PRE_BUILT_AGENTS_EXPERIMENT, PRE_BUILT_AGENTS_MODAL_KEY, VIEWS } from '@/constants';
import {
	getPrebuiltAgents,
	getRagStarterWorkflowJson,
	getSampleWorkflowByTemplateId,
} from '@/utils/templates/workflowSamples';
import { updateCurrentUserSettings } from '@/api/users';
import { useWorkflowsStore } from '@/stores/workflows.store';
import { usePostHog } from '@/stores/posthog.store';
import { useUIStore } from '@/stores/ui.store';

export function useCalloutHelpers() {
	const route = useRoute();
	const router = useRouter();
	const uiStore = useUIStore();
	const telemetry = useTelemetry();
	const postHog = usePostHog();
	const rootStore = useRootStore();
	const workflowsStore = useWorkflowsStore();
	const usersStore = useUsersStore();

	const openRagStarterTemplate = (nodeType?: string) => {
		telemetry.track('User clicked on RAG callout', {
			node_type: nodeType ?? null,
		});

		const template = getRagStarterWorkflowJson();

		const { href } = router.resolve({
			name: VIEWS.TEMPLATE_IMPORT,
			params: { id: template.meta.templateId },
			query: { fromJson: 'true', parentFolderId: route.params.folderId },
		});

		window.open(href, '_blank');
	};

	const isRagStarterCalloutVisible = computed(() => {
		const template = getRagStarterWorkflowJson();

		const routeTemplateId = route.query.templateId;
		const workflowObject = workflowsStore.workflowObject;
		const workflow = workflowsStore.getWorkflowById(workflowObject.id);

		// Hide the RAG starter callout if we're currently on the RAG starter template
		if ((routeTemplateId ?? workflow?.meta?.templateId) === template.meta.templateId) {
			return false;
		}

		return true;
	});

	const openPreBuiltAgentsModal = () => {
		uiStore.openModal(PRE_BUILT_AGENTS_MODAL_KEY);

		// const templates = getPrebuiltAgents();

		// const { href } = router.resolve({
		// 	name: VIEWS.TEMPLATE_IMPORT,
		// 	params: { id: templates[0].meta.templateId },
		// 	query: { fromJson: 'true', parentFolderId: route.params.folderId },
		// });

		// window.open(href, '_blank');
	};

	const openSampleWorkflowTemplateById = (templateId: string) => {
		const template = getSampleWorkflowByTemplateId(templateId);
		if (!template) {
			return;
		}

		const { href } = router.resolve({
			name: VIEWS.TEMPLATE_IMPORT,
			params: { id: template.meta.templateId },
			query: { fromJson: 'true', parentFolderId: route.params.folderId },
		});

		window.open(href, '_blank');
	};

	const isPreBuiltAgentsExperimentEnabled = computed(() => {
		return (
			postHog.getVariant(PRE_BUILT_AGENTS_EXPERIMENT.name) === PRE_BUILT_AGENTS_EXPERIMENT.variant
		);
	});

	const isPreBuiltAgentsCalloutVisible = computed(() => {
		const templates = getPrebuiltAgents();
		const templateIds = templates.map((template) => template.meta.templateId);

		const routeTemplateId = route.query.templateId;
		const workflowObject = workflowsStore.workflowObject;
		const workflow = workflowsStore.getWorkflowById(workflowObject.id);

		const currentTemplateId = routeTemplateId ?? workflow?.meta?.templateId;

		// Hide the callout if we're currently on one of the pre-built agent templates
		if (currentTemplateId && templateIds.includes(currentTemplateId.toString())) {
			return false;
		}

		return isPreBuiltAgentsExperimentEnabled.value;
	});

	const isCalloutDismissed = (callout: string) => {
		return usersStore.isCalloutDismissed(callout);
	};

	const dismissCallout = async (callout: string) => {
		usersStore.setCalloutDismissed(callout);

		await updateCurrentUserSettings(rootStore.restApiContext, {
			dismissedCallouts: {
				...usersStore.currentUser?.settings?.dismissedCallouts,
				[callout]: true,
			},
		});
	};

	return {
		openRagStarterTemplate,
		openPreBuiltAgentsModal,
		openSampleWorkflowTemplateById,
		isRagStarterCalloutVisible,
		isPreBuiltAgentsCalloutVisible,
		isCalloutDismissed,
		dismissCallout,
	};
}
