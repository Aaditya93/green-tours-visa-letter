"use client";
import { createClientList } from "@/actions/agent-platform/admin-panel/admin-panel";
import { Button } from "@/components/ui/button";

export const Test = () => {
  return (
    <div>
      <h1>Test</h1>
      <Button onClick={createClientList}>Test</Button>
    </div>
  );
};

export default Test;
