import * as readline from "readline";
import { t } from './i18n.js';

export function showFeatureDetail(featureKey: string, featureData: any, rl: readline.Interface, callback: () => void) {
  console.clear();
  console.log(t('detailTitle', featureKey.toUpperCase()) + '\n');
  
  // Kind (always present)
  console.log(`kind: ${featureData.kind}`);
  
  if (featureData.kind === 'feature') {
    // Name
    if (featureData.name) {
      console.log(`name: ${featureData.name}`);
    }
    
    // Description (plain text)
    if (featureData.description) {
      console.log(`description: ${featureData.description}`);
    }
    
    // Description HTML
    if (featureData.description_html) {
      console.log(`description_html: ${featureData.description_html}`);
    }
    
    // Specification URLs
    if (featureData.spec && featureData.spec.length > 0) {
      console.log(`spec:`);
      featureData.spec.forEach((url, index) => {
        console.log(`    [${index}]: ${url}`);
      });
    }
    
    // Group identifiers
    if (featureData.group && featureData.group.length > 0) {
      console.log(`group:`);
      featureData.group.forEach((groupId, index) => {
        console.log(`    [${index}]: ${groupId}`);
      });
    }
    
    // Snapshot identifiers
    if (featureData.snapshot && featureData.snapshot.length > 0) {
      console.log(`snapshot:`);
      featureData.snapshot.forEach((snapshotId, index) => {
        console.log(`    [${index}]: ${snapshotId}`);
      });
    }
    
    // caniuse.com identifiers
    if (featureData.caniuse && featureData.caniuse.length > 0) {
      console.log(`caniuse:`);
      featureData.caniuse.forEach((caniuseId, index) => {
        console.log(`    [${index}]: ${caniuseId}`);
      });
    }
    
    // Sources of support data
    if (featureData.compat_features && featureData.compat_features.length > 0) {
      console.log(`compat_features:`);
      featureData.compat_features.forEach((compatFeature, index) => {
        console.log(`    [${index}]: ${compatFeature}`);
      });
    }
    
    // Discouragement information
    if (featureData.discouraged) {
      console.log(`discouraged:`);
      console.log(`    according_to:`);
      featureData.discouraged.according_to.forEach((link, index) => {
        console.log(`        [${index}]: ${link}`);
      });
      if (featureData.discouraged.alternatives && featureData.discouraged.alternatives.length > 0) {
        console.log(`    alternatives:`);
        featureData.discouraged.alternatives.forEach((alt, index) => {
          console.log(`        [${index}]: ${alt}`);
        });
      }
    }
    
    // Status information
    if (featureData.status) {
      console.log("status:");
      console.log(`    baseline: ${featureData.status.baseline}`);
      
      if (featureData.status.baseline_low_date) {
        console.log(`    baseline_low_date: ${featureData.status.baseline_low_date}`);
      }
      
      if (featureData.status.baseline_high_date) {
        console.log(`    baseline_high_date: ${featureData.status.baseline_high_date}`);
      }
      
      if (featureData.status.support) {
        console.log("    support:");
        Object.entries(featureData.status.support).forEach(([browser, version]) => {
          console.log(`        ${browser}: ${version}`);
        });
      }
      
      if (featureData.status.by_compat_key) {
        console.log("    by_compat_key:");
        Object.entries(featureData.status.by_compat_key).forEach(([key, status]: [string, any]) => {
          console.log(`        ${key}:`);
          console.log(`            baseline: ${status.baseline}`);
          if (status.baseline_low_date) {
            console.log(`            baseline_low_date: ${status.baseline_low_date}`);
          }
          if (status.baseline_high_date) {
            console.log(`            baseline_high_date: ${status.baseline_high_date}`);
          }
          if (status.support) {
            console.log("            support:");
            Object.entries(status.support).forEach(([browser, version]) => {
              console.log(`                ${browser}: ${version}`);
            });
          }
        });
      }
    }
  } else if (featureData.kind === 'moved') {
    // Moved feature - single redirect target
    if (featureData.redirect_target) {
      console.log(`redirect_target: ${featureData.redirect_target}`);
    }
  } else if (featureData.kind === 'split') {
    // Split feature - multiple redirect targets
    if (featureData.redirect_targets && featureData.redirect_targets.length > 0) {
      console.log(`redirect_targets:`);
      featureData.redirect_targets.forEach((target, index) => {
        console.log(`    [${index}]: ${target}`);
      });
    }
  }
  
  console.log("\n" + "=".repeat(50));
  console.log('\n' + t('detailReturnPrompt'));
  
  rl.question("", () => {
    console.clear();
    callback();
  });
}