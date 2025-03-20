"use client";
import { createImmigrationCost } from "@/actions/agent-platform/immigration-cost";
import { Button } from "@/components/ui/button";

export const Test = () => {
  return (
    <div>
      <h1>Test</h1>
      <Button onClick={createImmigrationCost}>Test</Button>
    </div>
  );
};

export default Test;
