import { useEffect, useRef } from 'react';

const useWhyDidYouUpdate = (name, props) => {
    const previousProps = useRef();
    useEffect(() => {
        if (previousProps.current) {
            // 获取前后两次 props 所有的 key
            const allKeys = Object.keys({ ...previousProps.current, ...props });
            const changesObj = {};

            allKeys.forEach((key) => {
                // 比较前后值是否相等
                if (previousProps.current[key] !== props[key]) {
                    changesObj[key] = {
                        from: previousProps.current[key],
                        to: props[key],
                    };
                }
            });

            // 如果有变化，则打印输出
            if (Object.keys(changesObj).length) {
                console.log('[Why-Did-You-Update]', name, changesObj);
            }
        }
        // 更新上一次的 props
        previousProps.current = props;
    });
};

export default useWhyDidYouUpdate;