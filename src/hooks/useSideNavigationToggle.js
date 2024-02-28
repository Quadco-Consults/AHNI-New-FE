import { useSelector, useDispatch } from "react-redux";
import { toggleSideNavigationAction } from "configs/StoreSliceConfig";

function useSideNavigationToggle() {
  const dispatch = useDispatch();
  const isSideNavigation = useSelector(
    (state) => state.global.isSideNavigation
  );

  function toggleSideNavigation(payload) {
    dispatch(
      toggleSideNavigationAction(
        typeof payload === "boolean" ? payload : undefined
      )
    );
  }

  function setSideNavigation(payload) {
    dispatch(toggleSideNavigationAction(payload));
  }

  return [isSideNavigation, toggleSideNavigation, setSideNavigation];
}

export default useSideNavigationToggle;
