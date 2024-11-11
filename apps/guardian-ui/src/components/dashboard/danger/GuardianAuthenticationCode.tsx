import React, { useState } from 'react';
import {
  Text,
  useTheme,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Flex,
  Button,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import QRCode from 'qrcode.react';
import { QR_CODE_SIZE } from '../../../utils/constants';

const FEDIMINT_GUARDIAN_PREFIX = 'fedimint:guardian:';

type GuardianAuth = {
  inviteCode: string;
  peerId: number;
  name: string;
  password?: string;
};

interface GuardianAuthenticationCodeProps {
  inviteCode: string;
  ourPeer: { id: number; name: string };
}

export const GuardianAuthenticationCode: React.FC<
  GuardianAuthenticationCodeProps
> = ({ inviteCode, ourPeer }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [qrValue, setQrValue] = useState<string>('');
  const [isAcknowledged, setIsAcknowledged] = useState(false);

  const calculateGuardianAuthenticationCode = () => {
    const params: GuardianAuth = {
      inviteCode: inviteCode,
      peerId: ourPeer?.id,
      name: ourPeer?.name,
    };

    const password = sessionStorage.getItem('guardian-ui-key');
    if (password) {
      params.password = password;
    }
    return `${FEDIMINT_GUARDIAN_PREFIX}${JSON.stringify(params)}`;
  };

  const handleOpen = () => {
    setQrValue(calculateGuardianAuthenticationCode());
    setIsOpen(true);
    setIsAcknowledged(false);
  };
  const handleClose = () => setIsOpen(false);

  const handleAcknowledge = () => {
    setIsAcknowledged(true);
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        size={['sm', 'md']}
        bg={theme.colors.red[500]}
        _hover={{ bg: theme.colors.red[600] }}
      >
        {t('federation-dashboard.danger-zone.guardian-authenticate')}
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent minH='0'>
          <ModalHeader alignSelf='center'>
            {t('federation-dashboard.danger-zone.guardian-authenticate')}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {!isAcknowledged ? (
              <Flex
                justifyContent='center'
                alignItems='center'
                direction='column'
              >
                <Text mb={4}>
                  {t(
                    'federation-dashboard.danger-zone.guardian-warning-message'
                  )}
                </Text>
                <Flex
                  justifyContent='center'
                  gap={4}
                  direction={['column', 'row']}
                >
                  <Button
                    colorScheme='blue'
                    mr={3}
                    size={['sm', 'md']}
                    onClick={() => setIsOpen(false)}
                  >
                    {t('federation-dashboard.danger-zone.cancel')}
                  </Button>
                  <Button
                    variant='ghost'
                    size={['sm', 'md']}
                    onClick={() => {
                      handleAcknowledge();
                    }}
                  >
                    {t(
                      'federation-dashboard.danger-zone.acknowledge-and-download'
                    )}
                  </Button>
                </Flex>
              </Flex>
            ) : (
              <Flex
                justifyContent='center'
                alignItems='center'
                direction='column'
              >
                <QRCode
                  value={qrValue}
                  size={QR_CODE_SIZE}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxWidth: QR_CODE_SIZE,
                  }}
                />
                <Text fontWeight={'bold'} color={'red'} mt={4}>
                  {t(
                    'federation-dashboard.danger-zone.guardian-connect-warning'
                  )}
                </Text>
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
