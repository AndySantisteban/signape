import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";

/**
 * The function exports a React component for an action button with an icon and optional class and
 * disabled state.
 * @returns A React functional component named `ActionButton` is being returned. It takes four props:
 * `className`, `disabled`, `icon`, and `onClick`. It renders a button element with a FontAwesomeIcon
 * component inside it, which displays an icon passed in as a prop. The button element has a class of
 * `btn-action` and an optional `className` prop, and it is disabled if the `disabled
 */
export default function ActionButton({ className, disabled, icon, onClick }) {
  return (
    <button
      type="button"
      className={classnames("btn-action", { disabled }, className)}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={icon} color="white" />
    </button>
  );
}

ActionButton.defaultProps = {
  className: null,
  disabled: false,
};

ActionButton.propTypes = {
  disabled: PropTypes.bool,
  className: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  icon: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};
