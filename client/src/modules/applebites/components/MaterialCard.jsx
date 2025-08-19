import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { styled } from "@mui/material/styles";
// core components
import { Card as MuiCard } from "@mui/material";

const StyledCard = styled(MuiCard, {
  shouldForwardProp: (prop) => !['plain', 'profile', 'chart'].includes(prop),
})(({ theme, plain, profile, chart }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  wordWrap: 'break-word',
  backgroundColor: theme.palette.background.paper,
  backgroundClip: 'border-box',
  border: '0',
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  ...(plain && {
    backgroundColor: 'transparent',
    boxShadow: 'none',
  }),
  ...(profile && {
    textAlign: 'center',
  }),
  ...(chart && {
    backgroundColor: 'transparent',
  }),
}));

export default function Card(props) {
  const { children, plain, profile, chart, ...rest } = props;
  return (
    <StyledCard plain={plain} profile={profile} chart={chart} {...rest}>
      {children}
    </StyledCard>
  );
}

Card.propTypes = {
  className: PropTypes.string,
  plain: PropTypes.bool,
  profile: PropTypes.bool,
  chart: PropTypes.bool,
  children: PropTypes.node,
};
