// InviteCode.tsx
import React, { useState } from 'react';
import {
  Box,
  Icon,
  Text,
  useTheme,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Flex,
} from '@chakra-ui/react';
import { CopyInput } from '@fedimint/ui';
import { useTranslation } from '@fedimint/utils';
import { ReactComponent as CopyIcon } from '../../../assets/svgs/copy.svg';
import { ReactComponent as QrIcon } from '../../../assets/svgs/qr.svg';
import QRCode from 'qrcode.react';
import { QR_CODE_SIZE } from '../../../utils';

interface InviteCodeProps {
  inviteCode: string;
}

export const InviteCode: React.FC<InviteCodeProps> = ({ inviteCode }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <Box mt={['12px', '24px', '36px']} bg='blue.50' p={2} borderRadius='md'>
      <Text
        mb='6px'
        fontSize='14px'
        fontWeight='500'
        color={theme.colors.gray[700]}
      >
        {t('federation-dashboard.invite-members')}
      </Text>
      <Flex direction='row' alignItems='center' gap='6px'>
        <CopyInput
          value={inviteCode}
          buttonLeftIcon={<Icon as={CopyIcon} />}
          size='sm'
        />
        <Icon
          as={QrIcon}
          cursor='pointer'
          onClick={handleOpen}
          bg='white'
          boxSize='40px'
          borderRadius='10%'
          border='1px solid lightgray'
          _hover={{ bg: 'gray.100' }}
        />
      </Flex>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent minH='0'>
          <ModalHeader alignSelf='center'>
            {t('federation-dashboard.modal.client-connect')}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Flex
              justifyContent='center'
              alignItems='center'
              direction='column'
            >
              <QRCode
                value={inviteCode}
                size={QR_CODE_SIZE}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: QR_CODE_SIZE,
                }}
              />
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Text mt='6px' fontSize='14px' color={theme.colors.gray[500]}>
        {t('federation-dashboard.invite-members-prompt')}
      </Text>
    </Box>
  );
};
