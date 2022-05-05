import { IStackTokens, Stack, Text, Link, CompoundButton } from "@fluentui/react";
import React from "react";
import { useHistory } from "react-router-dom";

const gapStackTokens: IStackTokens = {
    childrenGap: 10,
    padding: 10,
};

export default function Ft3asHome() {
    const history = useHistory();
    return (
        <React.Fragment>
            <Stack wrap tokens={gapStackTokens}>
                <Stack.Item>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <Text variant="xLarge">Azure Design Review</Text>
                    </div>
                </Stack.Item>
                <Stack.Item>
                    <Text>Welcome to the self-service tool for Azure Design Reviews!</Text>
                </Stack.Item>
                <Stack.Item>
                    <Text>This is a tool in which the engineers from the Microsoft FastTrack for Azure organization have documented hundreds of best practices across different technologies so that anybody can benefit from them.</Text>
                </Stack.Item>
                <Stack.Item>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <CompoundButton primary secondaryText="Start now!" onClick={()=>{
                            history.push("/checklist");
                        }}>
                            Azure Design Review
                        </CompoundButton>
                    </div>
                </Stack.Item>
                <Stack.Item>
                    <Text>If you have any suggestion for any of the checklist items, please raise an issue in the </Text><Link href="http://github.com/Azure/review-checklists">Azure Review Checklist GitHub repository.</Link>
                </Stack.Item>
                <Stack.Item>
                    <Text>If you would like to get assistance for your Azure project, check out </Text><Link target="_blank" href={"https://azure.microsoft.com/programs/azure-fasttrack/"} >FastTrack for Azure</Link>

                </Stack.Item>
            </Stack>
        </React.Fragment>
    );
}