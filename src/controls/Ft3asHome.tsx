import { IStackTokens, Stack, Text, Link, CompoundButton, ITextStyles, ILinkStyles, IButtonStyles } from "@fluentui/react";
import React from "react";
import { useHistory } from "react-router-dom";

const gapStackTokens: IStackTokens = {
    childrenGap: 20,
    padding: 20,
};

const headingStyle: ITextStyles = {
    root: {
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#0078d4', // Azure blue
        textAlign: 'center',
        marginBottom: '10px',
    },
};

const textStyle: ITextStyles = {
    root: {
        fontSize: '20px',
        color: '#323130', // Neutral primary
        marginBottom: '10px',
    },
};

const linkStyle: ILinkStyles = {
    root: {
        fontSize: '20px',
        color: '#005a9e', // Link color
        fontWeight: '600',
    },
};

const buttonStyle: IButtonStyles = {
    root: {
        marginTop: '20px',
        marginRight: '20px',
        height:'75px',
        maxWidth:'300px'
    },
    label: {
        fontSize: '20px',
        fontWeight: 'bold',
    },
    secondaryText: {
        fontSize: '16px',
    },
};

export default function Ft3asHome() {
    const history = useHistory();
    return (
        <React.Fragment>
            <Stack horizontalAlign="center" tokens={gapStackTokens}>
                <Text styles={headingStyle}>Azure Design Review v2</Text>
                <Text styles={textStyle}>Welcome to our self-service portal for Azure Design Reviews, your go-to resource for streamlined project evaluations!</Text>
                <Text styles={textStyle}>
                    This tool is crafted by engineers at Microsoft FastTrack for Azure, who have diligently compiled hundreds of best practices spanning various Azure services, making it an invaluable resource for all users.
                </Text>
                <div>
                <CompoundButton primary secondaryText="Start now!" onClick={() => { window.sessionStorage.setItem('currentChecklist','alz'); history.push("/checklist"); return false }} styles={buttonStyle}>
                Azure Landing Zone Review
                </CompoundButton>
                <CompoundButton primary secondaryText="Start now!" onClick={() => history.push("/checklist")} styles={buttonStyle}>
                    Azure Design Review
                </CompoundButton>
                </div>
                <Text styles={textStyle}>
                    Should you have any recommendations for enhancing our checklist items, we warmly invite you to contribute by opening an issue in the <Link styles={linkStyle} href="http://github.com/Azure/review-checklists">Azure Review Checklist GitHub repository</Link>.
                </Text>
                <Text styles={textStyle}>
                    For specialized support with your Azure project, explore the exclusive benefits offered by <Link target="_blank" styles={linkStyle} href="https://azure.microsoft.com/programs/azure-fasttrack/">FastTrack for Azure</Link>.
                </Text>
            </Stack>
        </React.Fragment>
    );
}
