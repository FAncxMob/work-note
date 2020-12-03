import LinkSelector from '@/components/LinkSelector';

export default ({ propName, value, changeMethod }) => {
  function change({ linkType, linkVal }) {
    changeMethod(propName, { linkType, link: linkVal });
  }

  return <LinkSelector value={value} onChange={change} />;
};
