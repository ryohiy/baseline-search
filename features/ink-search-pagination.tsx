import React, { useState, useEffect } from 'react';
import { render, Text, Box, useInput, useApp } from 'ink';
import { features } from 'web-features';
import { t } from './i18n.js';

type FeatureWithKey = any & { key: string };

interface SearchPaginationResult {
  selectedFeature: FeatureWithKey | null;
  cancelled: boolean;
}

const InkSearchPaginationApp: React.FC<{ onExit: (result: SearchPaginationResult) => void }> = ({ onExit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const { exit } = useApp();
  
  const PAGE_SIZE = 10;
  
  // 全機能リスト
  const allFeatures: FeatureWithKey[] = Object.entries(features).map(([key, feature]) => ({
    key,
    ...feature
  }));

  // 検索機能（機能ID（key）と名前の部分一致）
  const searchFeatures = (keyword: string): FeatureWithKey[] => {
    if (!keyword.trim()) return allFeatures; // 空の場合は全機能を返す
    
    const lowerKeyword = keyword.toLowerCase();
    
    return allFeatures.filter(feature => {
      // 機能ID（key）での検索
      if (feature.key.toLowerCase().includes(lowerKeyword)) return true;
      
      // 名前での検索（feature kindの場合のみ）
      if (feature.kind === 'feature' && feature.name && 
          feature.name.toLowerCase().includes(lowerKeyword)) return true;
          
      return false;
    });
  };

  // 現在の表示用機能リスト
  const displayFeatures = searchFeatures(searchTerm);
  const totalPages = Math.ceil(displayFeatures.length / PAGE_SIZE);
  const startIndex = currentPage * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, displayFeatures.length);
  const currentPageFeatures = displayFeatures.slice(startIndex, endIndex);

  // 検索語変更時の処理
  useEffect(() => {
    setCurrentPage(0);
    setSelectedIndex(0);
  }, [searchTerm]);

  // ページ変更時に選択インデックスをリセット
  useEffect(() => {
    setSelectedIndex(0);
  }, [currentPage]);

  // カーソル点滅効果（検索モード時のみ）
  useEffect(() => {
    if (!isSearchMode) {
      setCursorVisible(true);
      return;
    }

    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500); // 500ms間隔で点滅

    return () => clearInterval(interval);
  }, [isSearchMode]);

  // キーボード入力処理
  useInput((input, key) => {
    if (key.escape) {
      if (isSearchMode) {
        // 検索モードの場合は検索モードを終了
        setIsSearchMode(false);
        return;
      } else {
        // 通常モードの場合はアプリ終了
        onExit({ selectedFeature: null, cancelled: true });
        return;
      }
    }

    if (input === 'q' && !isSearchMode) {
      // qキーでキャンセル（検索モード以外）
      onExit({ selectedFeature: null, cancelled: true });
      return;
    }

    if (key.return) {
      // Enterキーで機能選択（検索モード・通常モード問わず）
      if (currentPageFeatures.length > 0 && selectedIndex < currentPageFeatures.length) {
        onExit({ selectedFeature: currentPageFeatures[selectedIndex], cancelled: false });
      }
      return;
    }

    if ((input === '/' || input === 's') && !isSearchMode) {
      // /キーまたはsキーで検索モードに切り替え（検索モード中は除く）
      setIsSearchMode(true);
      return;
    }

    if (key.ctrl && input === 'c') {
      // Ctrl+Cで検索語をクリア
      setSearchTerm('');
      setIsSearchMode(false);
      return;
    }

    // ナビゲーション操作（検索モード・通常モード問わず利用可能）
    if (key.upArrow) {
      // 上矢印
      setSelectedIndex(prev => Math.max(0, prev - 1));
      return;
    }

    if (key.downArrow) {
      // 下矢印
      setSelectedIndex(prev => Math.min(currentPageFeatures.length - 1, prev + 1));
      return;
    }

    if (key.leftArrow && currentPage > 0) {
      // 左矢印で前のページ
      setCurrentPage(prev => Math.max(0, prev - 1));
      return;
    }

    if (key.rightArrow && currentPage < totalPages - 1) {
      // 右矢印で次のページ
      setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
      return;
    }

    // 検索モード中の文字入力処理
    if (isSearchMode) {
      if (key.backspace || key.delete) {
        // バックスペース
        setSearchTerm(prev => prev.slice(0, -1));
        return;
      }

      if (input && !key.ctrl && !key.meta && !/^[1-9]$/.test(input)) {
        // 通常の文字入力（数字キーは除外してページジャンプを優先）
        setSearchTerm(prev => prev + input);
        return;
      }
    }

    // 数字キーでページジャンプ（検索モード・通常モード問わず）
    if (input && /^[1-9]$/.test(input)) {
      const pageNum = parseInt(input) - 1;
      if (pageNum < totalPages) {
        setCurrentPage(pageNum);
      }
      return;
    }
  });

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color="cyan">
          {t('searchTitle')}
        </Text>
      </Box>
      
      <Box marginBottom={1}>
        <Text color="yellow">{t('searchKeyword')}</Text>
        <Text color="white">{searchTerm || ""}</Text>
        {isSearchMode && cursorVisible && <Text color="gray">|</Text>}
        {isSearchMode && !cursorVisible && <Text color="gray"> </Text>}
        {searchTerm && !isSearchMode && (
          <Text color="gray">{t('searchClearHint')}</Text>
        )}
      </Box>

      <Box marginBottom={1}>
        <Text color="green">
          {displayFeatures.length > 0 
            ? t('searchResults', displayFeatures.length)
            : t('searchNoResults')
          }
          {searchTerm && ` (${t('search')}: "${searchTerm}")`}
        </Text>
      </Box>

      {totalPages > 0 && (
        <Box marginBottom={1}>
          <Text color="yellow">
            {t('searchPageInfo', currentPage + 1, totalPages, startIndex + 1, endIndex)}
          </Text>
        </Box>
      )}

      {currentPageFeatures.length > 0 && (
        <Box flexDirection="column" marginBottom={1}>
          {currentPageFeatures.map((feature, index) => {
            const isBaslineHigh = feature.status?.baseline === 'high';
            const isBaslineLow = feature.status?.baseline === 'low';
            const isBaslineFalse = feature.status?.baseline === false;
            return (
              <Box key={feature.key}>
                <Text 
                  color={index === selectedIndex ? 'black' : 'white'} 
                  backgroundColor={index === selectedIndex ? 'cyan' : undefined}
                >
                  {index === selectedIndex ? '► ' : '  '}
                  {isBaslineHigh && <Text color="green">● </Text>}
                  {isBaslineLow && <Text color="#1D7AFC">● </Text>}
                  {isBaslineFalse && <Text color="#E56910">● </Text>}
                  {feature.name}
                </Text>
              </Box>
            );
          })}
        </Box>
      )}

      {totalPages > 1 && (
        <Box marginTop={1}>
          <Text color="gray">
            {isSearchMode 
              ? t('searchInstructionsSearch')
              : t('searchInstructions')
            }
          </Text>
        </Box>
      )}

      {!isSearchMode && totalPages <= 9 && totalPages > 1 && (
        <Box marginTop={1}>
          <Text color="gray">
            {t('searchInstructionsNoPage', Math.min(9, totalPages))}
          </Text>
        </Box>
      )}

      {currentPageFeatures.length === 0 && searchTerm && (
        <Box marginTop={1}>
          <Text color="gray">
            {t('searchTryOtherKeywords')}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export function startInkSearchPagination(): Promise<SearchPaginationResult> {
  return new Promise((resolve) => {
    let unmountFunction: (() => void) | null = null;
    
    const handleExit = (result: SearchPaginationResult) => {
      // inkアプリを適切にアンマウント
      if (unmountFunction) {
        unmountFunction();
      }
      // 少し待ってからresolve（ターミナル状態をクリアするため）
      setTimeout(() => {
        resolve(result);
      }, 150);
    };

    // stdinとstdoutを明示的に指定してinkを初期化
    const options = {
      stdin: process.stdin,
      stdout: process.stdout,
      stderr: process.stderr,
      debug: false
    };

    const { unmount } = render(<InkSearchPaginationApp onExit={handleExit} />, options);
    unmountFunction = unmount;
  });
}