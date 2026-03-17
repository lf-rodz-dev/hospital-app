import { RotateCcw } from "lucide-react";
import { Button } from "../ui/button";

type Props={
    handleClearFilters: () => void;
}

const ClearFilters = ({handleClearFilters}: Props) => {
  return (
    <Button onClick={handleClearFilters}>
      <RotateCcw className="h-4 w-4" />
    </Button>
  );
};

export default ClearFilters;
