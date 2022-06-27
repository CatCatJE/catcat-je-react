/* eslint-disable prettier/prettier */
import React from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import About from '../pages/About';
import '../styles/slider-menu.css';
import CatCatSign from './CatCatSign';
import MenuItem from './MenuItem';

// eslint-disable-next-line import/order

const SliderNav = (prop: any | undefined) => {
  console.info(prop);
  const dataProp = {
   ...prop
  }
  const menuList = ['🐱', '设置'];
  const data = {
    color: {
      color: '#efefef',
    },
    menu_0: {
      name: menuList[0],
      // eslint-disable-next-line prettier/prettier
      svg: ''
    // eslint-disable-next-line prettier/prettier
    // eslint-disable-next-line prettier/prettier
    },
    menu_2: {
      name: menuList[1],
      // eslint-disable-next-line prettier/prettier
      svg:<svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9082" width="25" height="25"><path d="M509.953388 57.464783c-250.633271 0-454.535217 203.90297-454.535217 454.535217 0 250.662947 203.901946 454.535217 454.535217 454.535217 250.638387 0 454.535217-203.895807 454.535217-454.535217C964.488605 261.368776 760.590751 57.464783 509.953388 57.464783L509.953388 57.464783zM508.23935 923.475516c-227.256864 0-412.150898-184.888917-412.150898-412.150898 0-227.256864 184.895057-412.150898 412.150898-412.150898 227.263004 0 412.150898 184.895057 412.150898 412.150898C920.391271 738.586598 735.502353 923.475516 508.23935 923.475516L508.23935 923.475516zM509.953388 913.060305" p-id="9083" fill="#515151" /><path d="M510.004553 432.933223c-14.559601 0-26.373671 11.812023-26.373671 26.372647l0 303.290561c0 14.583137 11.81407 26.372647 26.373671 26.372647s26.372647-11.789511 26.372647-26.372647L536.3772 459.304847C536.376177 444.745247 524.564154 432.933223 510.004553 432.933223L510.004553 432.933223zM510.004553 432.933223" p-id="9084" fill="#515151"></path><path d="M457.258235 301.068963c0 13.804401 5.686513 27.53103 15.446807 37.292348 9.766434 9.766434 23.486924 15.452947 37.299511 15.452947 13.81054 0 27.53103-5.686513 37.299511-15.452947 9.766434-9.761318 15.446807-23.48897 15.446807-37.292348 0-13.811564-5.680373-27.53717-15.446807-37.299511-9.767458-9.766434-23.48897-15.452947-37.299511-15.452947-13.811564 0-27.533077 5.686513-37.299511 15.452947C462.944747 273.531793 457.258235 287.257399 457.258235 301.068963L457.258235 301.068963zM457.258235 301.068963" p-id="9085" fill="#515151"></path></svg>
    },
  };
  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialRef = React.useRef()
  let love =0 ;
  let lastBtn:Array<number>;
  const toast = useToast();
  const openLove = () => {
    // eslint-disable-next-line no-plusplus
    love++;
    if(love >4){
      toast({
        title: '',
        description: '🐱🐱🐱🐱🐱🐱❤❤❤❤❤❤🐱🐱🐱🐱🐱🐱🐱',
        status: undefined,
        duration: 2000,
        isClosable: false,
      });
      love =0;
    }

  }
  const startDanmuWindow = ()=> {
    window.electron.ipcRenderer.sendMessage('open-setting-window',[])
  }
    return (
      // eslint-disable-next-line react/jsx-no-comment-textnodes
      <>

      <div className="slider-menu">

          <div className="menu-photo">

            <p />
            {dataProp.nickname}
          </div>
          <div className="menu-list">
            <MenuItem menu = {data.menu_0} click = {openLove}/>
            <MenuItem menu = {data.menu_2} click = {startDanmuWindow}/>
          </div>
          <CatCatSign color = {data.color} />
        </div>
        <Modal autoFocus={false} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay
              bg='blackAlpha.300'
              backdropFilter='blur(10px) hue-rotate(90deg)'
            />
            <ModalContent>
              <ModalHeader>关于</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <About />
              </ModalBody>

              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose} ref={initialRef}>
                  关闭
                </Button>
              </ModalFooter>
            </ModalContent>
        </Modal>
      </>
    )

}
export default SliderNav
