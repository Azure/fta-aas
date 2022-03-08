import { IChecklistDocument } from "../model/IChecklistDocument";

class TemplateService {
    getAvailableTemplates(): Promise<string[]> {
        // TODO: Get list of templates from github.com

        // fake result
        return Promise.resolve(["https://raw.githubusercontent.com/Azure/review-checklists/main/checklists/aks_checklist.en.json",
            "https://raw.githubusercontent.com/Azure/review-checklists/main/checklists/avd_checklist.en.json",
            "https://raw.githubusercontent.com/Azure/review-checklists/main/checklists/lz_checklist.en.json",
            "https://raw.githubusercontent.com/Azure/review-checklists/main/checklists/multitenancy_checklist.en.json",
            "https://raw.githubusercontent.com/Azure/review-checklists/main/checklists/security_checklist.en.json"]);
    }
    async openTemplate(url: string): Promise<IChecklistDocument> {
        const response = await fetch(url);
        return (await response.json()) as IChecklistDocument;
    }
}

const TemplateServiceInstance = new TemplateService();

export default TemplateServiceInstance;