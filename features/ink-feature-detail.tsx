import React, { useState } from 'react';
import { render, Text, Box, useInput, useApp } from 'ink';
import { getStatus } from 'compute-baseline';

interface FeatureDetailProps {
  featureKey: string;
  featureData: any;
  onExit: () => void;
}

const InkFeatureDetailApp: React.FC<FeatureDetailProps> = ({ featureKey, featureData, onExit }) => {
  const { exit } = useApp();

  // キーボード入力処理（Enterで終了）
  useInput((input, key) => {
    if (key.return || key.escape) {
      onExit();
      return;
    }
  });

  const renderFeatureContent = () => {
    const content: React.ReactElement[] = [];
    
    // Kind (always present)
    content.push(
      <Box key="kind" marginBottom={1}>
        <Text color="cyan">kind: </Text>
        <Text>{featureData.kind}</Text>
      </Box>
    );

    if (featureData.kind === 'feature') {
      // Name
      if (featureData.name) {
        content.push(
          <Box key="name" marginBottom={1}>
            <Text color="cyan">name: </Text>
            <Text>{featureData.name}</Text>
          </Box>
        );
      }
      
      // Description (plain text)
      if (featureData.description) {
        content.push(
          <Box key="description" marginBottom={1} flexDirection="column">
            <Text color="cyan">description:</Text>
            <Text>{featureData.description}</Text>
          </Box>
        );
      }
      
      // // Description HTML
      // if (featureData.description_html) {
      //   content.push(
      //     <Box key="description_html" marginBottom={1} flexDirection="column">
      //       <Text color="cyan">description_html:</Text>
      //       <Text>{featureData.description_html}</Text>
      //     </Box>
      //   );
      // }
      
      // Specification URLs
      if (featureData.spec && featureData.spec.length > 0) {
        content.push(
          <Box key="spec" marginBottom={1} flexDirection="column">
            <Text color="cyan">spec:</Text>
            {featureData.spec.map((url: string, index: number) => (
              <Box key={index} marginLeft={2}>
                <Text color="gray">[{index}]: </Text>
                <Text>{url}</Text>
              </Box>
            ))}
          </Box>
        );
      }
      
      // Group identifiers
      if (featureData.group && featureData.group.length > 0) {
        content.push(
          <Box key="group" marginBottom={1} flexDirection="column">
            <Text color="cyan">group:</Text>
            {featureData.group.map((groupId: string, index: number) => (
              <Box key={index} marginLeft={2}>
                <Text color="gray">[{index}]: </Text>
                <Text>{groupId}</Text>
              </Box>
            ))}
          </Box>
        );
      }
     
      // Status information
      if (featureData.status) {
        content.push(
          <Box key="status" marginBottom={1} flexDirection="column">
            <Text color="cyan">status:</Text>
            <Box marginLeft={2} flexDirection="column">
              <Box>
                <Text color="yellow">baseline: </Text>
                <Text>{featureData.status.baseline}</Text>
              </Box>
              
              {featureData.status.baseline_low_date && (
                <Box>
                  <Text color="yellow">baseline_low_date: </Text>
                  <Text>{featureData.status.baseline_low_date}</Text>
                </Box>
              )}
              
              {featureData.status.baseline_high_date && (
                <Box>
                  <Text color="yellow">baseline_high_date: </Text>
                  <Text>{featureData.status.baseline_high_date}</Text>
                </Box>
              )}
              
              {featureData.status.support && (
                <Box flexDirection="column">
                  <Text color="yellow">support:</Text>
                  {Object.entries(featureData.status.support).map(([browser, version]) => (
                    <Box key={browser} marginLeft={2}>
                      <Text color="gray">{browser}: </Text>
                      <Text>{version as string}</Text>
                    </Box>
                  ))}
                </Box>
              )}
              
              {featureData.status.by_compat_key && (
                <Box flexDirection="column">
                  <Text color="yellow">by_compat_key:</Text>
                  {Object.entries(featureData.status.by_compat_key).map(([key, status]: [string, any]) => (
                    <Box key={key} marginLeft={2} flexDirection="column">
                      <Text color="gray">{key}:</Text>
                      <Box marginLeft={2} flexDirection="column">
                        <Box>
                          <Text color="magenta">baseline: </Text>
                          <Text>{status.baseline}</Text>
                        </Box>
                        {status.baseline_low_date && (
                          <Box>
                            <Text color="magenta">baseline_low_date: </Text>
                            <Text>{status.baseline_low_date}</Text>
                          </Box>
                        )}
                        {status.baseline_high_date && (
                          <Box>
                            <Text color="magenta">baseline_high_date: </Text>
                            <Text>{status.baseline_high_date}</Text>
                          </Box>
                        )}
                        {status.support && (
                          <Box flexDirection="column">
                            <Text color="magenta">support:</Text>
                            {Object.entries(status.support).map(([browser, version]) => (
                              <Box key={browser} marginLeft={2}>
                                <Text color="gray">{browser}: </Text>
                                <Text>{version as string}</Text>
                              </Box>
                            ))}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        );
      }
      
      // Snapshot identifiers
      if (featureData.snapshot && featureData.snapshot.length > 0) {
        content.push(
          <Box key="snapshot" marginBottom={1} flexDirection="column">
            <Text color="cyan">snapshot:</Text>
            {featureData.snapshot.map((snapshotId: string, index: number) => (
              <Box key={index} marginLeft={2}>
                <Text color="gray">[{index}]: </Text>
                <Text>{snapshotId}</Text>
              </Box>
            ))}
          </Box>
        );
      }
      
      // caniuse.com identifiers
      if (featureData.caniuse && featureData.caniuse.length > 0) {
        content.push(
          <Box key="caniuse" marginBottom={1} flexDirection="column">
            <Text color="cyan">caniuse:</Text>
            {featureData.caniuse.map((caniuseId: string, index: number) => (
              <Box key={index} marginLeft={2}>
                <Text color="gray">[{index}]: </Text>
                <Text>{caniuseId}</Text>
              </Box>
            ))}
          </Box>
        );
      }
      
      // Sources of support data
      if (featureData.compat_features && featureData.compat_features.length > 0) {
        content.push(
          <Box key="compat_features" marginBottom={1} flexDirection="column">
            <Text color="cyan">compat_features:</Text>
            {featureData.compat_features.map((compatFeature: string, index: number) => {
              // Get baseline status for this compat feature
              let baselineInfo = null;
              try {
                baselineInfo = getStatus(featureKey, compatFeature);
              } catch (error) {
                // If getStatus fails, continue without baseline info
              }
              
              return (
                <Box key={index} marginLeft={2} flexDirection="column">
                  <Box>
                    <Text color="gray">[{index}]: </Text>
                    <Text>{compatFeature}</Text>
                  </Box>
                  {baselineInfo && (
                    <Box marginLeft={4} flexDirection="column">
                      <Box>
                        <Text color="yellow">baseline: </Text>
                        <Text>{baselineInfo.baseline}</Text>
                      </Box>
                      {baselineInfo.baseline_low_date && (
                        <Box>
                          <Text color="yellow">baseline_low_date: </Text>
                          <Text>{baselineInfo.baseline_low_date}</Text>
                        </Box>
                      )}
                      {baselineInfo.baseline_high_date && (
                        <Box>
                          <Text color="yellow">baseline_high_date: </Text>
                          <Text>{baselineInfo.baseline_high_date}</Text>
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        );
      }
      
      // Discouragement information
      if (featureData.discouraged) {
        content.push(
          <Box key="discouraged" marginBottom={1} flexDirection="column">
            <Text color="cyan">discouraged:</Text>
            <Box marginLeft={2} flexDirection="column">
              <Text color="yellow">according_to:</Text>
              {featureData.discouraged.according_to.map((link: string, index: number) => (
                <Box key={index} marginLeft={2}>
                  <Text color="gray">[{index}]: </Text>
                  <Text>{link}</Text>
                </Box>
              ))}
              {featureData.discouraged.alternatives && featureData.discouraged.alternatives.length > 0 && (
                <>
                  <Text color="yellow">alternatives:</Text>
                  {featureData.discouraged.alternatives.map((alt: string, index: number) => (
                    <Box key={index} marginLeft={2}>
                      <Text color="gray">[{index}]: </Text>
                      <Text>{alt}</Text>
                    </Box>
                  ))}
                </>
              )}
            </Box>
          </Box>
        );
      }

    } else if (featureData.kind === 'moved') {
      // Moved feature - single redirect target
      if (featureData.redirect_target) {
        content.push(
          <Box key="redirect_target" marginBottom={1}>
            <Text color="cyan">redirect_target: </Text>
            <Text>{featureData.redirect_target}</Text>
          </Box>
        );
      }
    } else if (featureData.kind === 'split') {
      // Split feature - multiple redirect targets
      if (featureData.redirect_targets && featureData.redirect_targets.length > 0) {
        content.push(
          <Box key="redirect_targets" marginBottom={1} flexDirection="column">
            <Text color="cyan">redirect_targets:</Text>
            {featureData.redirect_targets.map((target: string, index: number) => (
              <Box key={index} marginLeft={2}>
                <Text color="gray">[{index}]: </Text>
                <Text>{target}</Text>
              </Box>
            ))}
          </Box>
        );
      }
    }

    return content;
  };

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color="cyan">
          === {featureKey.toUpperCase()} 詳細情報 ===
        </Text>
      </Box>
      
      {renderFeatureContent()}
      
      <Box marginTop={1} borderStyle="single" borderColor="gray" paddingX={1}>
        <Text color="green">EnterまたはESCで戻る</Text>
      </Box>
    </Box>
  );
};

export function startInkFeatureDetail(featureKey: string, featureData: any): Promise<void> {
  return new Promise((resolve) => {
    let unmountFunction: (() => void) | null = null;
    
    const handleExit = () => {
      // inkアプリを適切にアンマウント
      if (unmountFunction) {
        unmountFunction();
        unmountFunction = null;
      }
      // 少し待ってからresolve
      setTimeout(() => {
        resolve();
      }, 150);
    };

    // stdinとstdoutを明示的に指定してinkを初期化
    const options = {
      stdin: process.stdin,
      stdout: process.stdout,
      stderr: process.stderr,
      debug: false
    };

    const { unmount } = render(
      <InkFeatureDetailApp 
        featureKey={featureKey} 
        featureData={featureData} 
        onExit={handleExit} 
      />, 
      options
    );
    unmountFunction = unmount;
  });
}