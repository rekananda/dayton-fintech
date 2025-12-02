'use client';

import { Button, Flex } from "@mantine/core";
import { ControlLayoutT } from "./type";
import MainText from "../Atoms/MainText";
import Icon from "../Atoms/Icon";
import useViewport from "@/hooks/useViewport";
import { useEffect } from "react";
import { setTitlePage } from "@/store/backofficeSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const ControlLayout = ({ title, modalLabel, openModal}: ControlLayoutT) => {
  const { isMobile } = useViewport();
  const { defaultTitlePage } = useAppSelector((state) => state.backoffice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setTitlePage(`${defaultTitlePage} | ${title}`));
  }, [title, dispatch, defaultTitlePage]);

  return (
    <Flex gap={16} justify="space-between" direction={isMobile ? "column" : "row"}>
      <MainText variant="body-bold" fz={24} >{title}</MainText>
      {modalLabel && (
        <Button radius="xl" onClick={openModal} leftSection={<Icon name="IconPlus" />} >
          {modalLabel}
        </Button>
      )}
    </Flex>
  );
}

export default ControlLayout;