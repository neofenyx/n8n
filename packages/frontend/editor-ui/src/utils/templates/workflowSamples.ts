import { ApplicationError } from 'n8n-workflow';
import type { WorkflowDataWithTemplateId } from '@/Interface';
import { isWorkflowDataWithTemplateId } from '@/utils/templates/typeGuards';

/* eslint-disable import-x/extensions */
import easyAiStarterJson from '@/utils/templates/samples/easy_ai_starter.json';
import ragStarterJson from '@/utils/templates/samples/rag_starter.json';
import emailTriageAgentWithGmailJson from '@/utils/templates/samples/agents/email_triage_agent_with_gmail.json';
import jokeAgentWithHttpToolJson from '@/utils/templates/samples/agents/joke_agent_with_http_tool.json';
import knowledgeStoreAgentWithGoogleDriveJson from '@/utils/templates/samples/agents/knowledge_store_agent_with_google_drive.json';
import taskManagementAgentWithGoogleSheetsJson from '@/utils/templates/samples/agents/task_management_agent_with_google_sheets.json';
import voiceAssistantAgentWithTelegramAndGcalJson from '@/utils/templates/samples/agents/voice_assistant_agent_with_telegram_and_gcal.json';
/* eslint-enable import-x/extensions */

const getWorkflowJson = (json: unknown): WorkflowDataWithTemplateId => {
	if (!isWorkflowDataWithTemplateId(json)) {
		throw new ApplicationError('Invalid Easy AI workflow JSON structure');
	}

	return json;
};

export const getEasyAiWorkflowJson = (): WorkflowDataWithTemplateId => {
	return getWorkflowJson(easyAiStarterJson);
};

export const getRagStarterWorkflowJson = (): WorkflowDataWithTemplateId => {
	return getWorkflowJson(ragStarterJson);
};

export const getPrebuiltAgents = (): WorkflowDataWithTemplateId[] => {
	return [
		getWorkflowJson(emailTriageAgentWithGmailJson),
		getWorkflowJson(jokeAgentWithHttpToolJson),
		getWorkflowJson(knowledgeStoreAgentWithGoogleDriveJson),
		getWorkflowJson(taskManagementAgentWithGoogleSheetsJson),
		getWorkflowJson(voiceAssistantAgentWithTelegramAndGcalJson),
	];
};

export const getSampleWorkflowByTemplateId = (
	templateId: string,
): WorkflowDataWithTemplateId | undefined => {
	const workflows = [getEasyAiWorkflowJson(), getRagStarterWorkflowJson(), ...getPrebuiltAgents()];

	return workflows.find((workflow) => workflow.meta.templateId === templateId);
};
