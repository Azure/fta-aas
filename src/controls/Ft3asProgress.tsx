import * as React from 'react';
import { ProgressIndicator } from '@fluentui/react/lib/ProgressIndicator';

interface Ft3asProgressProps {
    percentComplete?: number;
}

export function Ft3asProgress(props: Ft3asProgressProps) {
  return (
    <ProgressIndicator label="Review progress" description="" percentComplete={props.percentComplete} />
  );
};
