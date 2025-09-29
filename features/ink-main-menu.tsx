import React, { useState } from 'react';
import { render, Text, Box, useInput, useApp } from 'ink';

interface MenuResult {
  choice: number | null;
  cancelled: boolean;
}

const InkMainMenuApp: React.FC<{ onExit: (result: MenuResult) => void }> = ({ onExit }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { exit } = useApp();

  const menuItems = [
    { key: 1, label: "フリーワード検索（ページネーション+フリーワード）" },
    { key: 2, label: "Baseline Target（年別一覧）" },
    { key: 3, label: "Exit (終了)" }
  ];

  useInput((input, key) => {
    if (key.escape || input === 'q') {
      exit();
      onExit({ choice: null, cancelled: true });
      return;
    }

    if (key.upArrow) {
      setSelectedIndex(prev => Math.max(0, prev - 1));
      return;
    }

    if (key.downArrow) {
      setSelectedIndex(prev => Math.min(menuItems.length - 1, prev + 1));
      return;
    }

    if (key.return) {
      const selectedChoice = menuItems[selectedIndex].key;
      exit();
      onExit({ choice: selectedChoice, cancelled: false });
      return;
    }

    // 数字キーでの直接選択
    const num = parseInt(input);
    if (num >= 1 && num <= 3) {
      exit();
      onExit({ choice: num, cancelled: false });
      return;
    }
  });

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">
        === WEB FEATURES DOCS CLI ===
      </Text>
      <Text>
        Web機能データの詳細検索・閲覧ツール
      </Text>
      <Text> </Text>
      <Text>
        どの機能を利用しますか?
      </Text>
      <Text> </Text>

      {menuItems.map((item, index) => (
        <Box key={item.key}>
          <Text color={index === selectedIndex ? "green" : "white"}>
            {index === selectedIndex ? "► " : "  "}
            {item.key}. {item.label}
          </Text>
        </Box>
      ))}

      <Text> </Text>
      <Text color="gray">
        ↑↓: 選択移動 | Enter: 決定 | 1-3: 直接選択 | ESC/q: 終了
      </Text>
    </Box>
  );
};

export function showInkMainMenu(): Promise<MenuResult> {
  return new Promise((resolve) => {
    render(<InkMainMenuApp onExit={resolve} />);
  });
}