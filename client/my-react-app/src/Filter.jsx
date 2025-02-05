import { useState } from "react";
import PropTypes from "prop-types";

const Filter = ({ onFilter }) => {
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");

  const handleFilter = () => {
    onFilter({ category, startDate});
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <button onClick={handleFilter}>Filter</button>
    </div>
  );
};
Filter.propTypes = {
  onFilter: PropTypes.func.isRequired,
};

export default Filter;