import ListTabs from '../../../components/List/ListBranch';

// const a = 1;
// console.log(a)
const Tabs = [
  {
    text: '進行中(1)',
    to: '/tabs/tab1',
  },
  {
    text: 'すべて(6)',
    to: '/tabs/tab2',
  },
  {
    text: '差し戻し(2)',
    to: '/tabs/tab3',
  },
  {
    text: '却下(2)',
    to: '/tabs/tab4',
  },
  {
    text: '完了(2)',
    to: '/tabs/tab5',
  },
  {
    text: '下書き(1)',
    to: '/tabs/tab6',
  },
  {
    text: '取り消し(2)',
    to: '/tabs/tab7',
  },
];


const NavForm = () => {
  return(
    <>
      <ListTabs branch={Tabs} />
    </>
  )
};

export default NavForm;
