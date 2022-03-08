import React from 'react';
import { render, screen } from '@testing-library/react';
import TemplateServiceInstance from './service/TemplateService';

it('Download checklist template', () => {
    const checklistSampleUrl = 'https://github.com/Azure/review-checklists/blob/main/checklists/aks_checklist.en.json';
    TemplateServiceInstance.openTemplate(checklistSampleUrl).then(doc => {
        console.info(doc.items.length);
    });
});