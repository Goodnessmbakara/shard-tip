// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {CreatorRegistry} from "../contracts/CreatorRegistry.sol";

contract CreatorRegistryTest is Test {
    CreatorRegistry public registry;
    
    address public creator1 = address(0x1);
    address public creator2 = address(0x2);

    function setUp() public {
        registry = new CreatorRegistry();
    }

    function testRegisterCreator() public {
        vm.prank(creator1);
        registry.registerCreator(
            "Alice Creator",
            "A talented artist",
            "QmYh2L4P7Q6R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H",
            "Art",
            new string[](0)
        );

        assertEq(registry.totalCreators(), 1);
        assertEq(registry.registeredCreators(0), creator1);
    }

    function testCannotRegisterTwice() public {
        vm.startPrank(creator1);
        registry.registerCreator(
            "Alice Creator",
            "A talented artist",
            "QmYh2L4P7Q6R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H",
            "Art",
            new string[](0)
        );

        vm.expectRevert("CreatorRegistry: Already registered");
        registry.registerCreator(
            "Alice Creator 2",
            "Another description",
            "QmYh2L4P7Q6R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3I",
            "Music",
            new string[](0)
        );
        vm.stopPrank();
    }

    function testGetTotalCreators() public {
        assertEq(registry.totalCreators(), 0);

        vm.prank(creator1);
        registry.registerCreator(
            "Alice Creator",
            "A talented artist",
            "QmYh2L4P7Q6R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H",
            "Art",
            new string[](0)
        );

        assertEq(registry.totalCreators(), 1);

        vm.prank(creator2);
        registry.registerCreator(
            "Bob Creator",
            "A talented musician",
            "QmYh2L4P7Q6R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3I",
            "Music",
            new string[](0)
        );

        assertEq(registry.totalCreators(), 2);
    }

    function testUpdateProfile() public {
        vm.startPrank(creator1);
        registry.registerCreator(
            "Alice Creator",
            "A talented artist",
            "QmYh2L4P7Q6R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H",
            "Art",
            new string[](0)
        );

        registry.updateProfile(
            "Alice Updated",
            "Updated description",
            "QmNewHash",
            "Digital Art",
            new string[](0)
        );
        vm.stopPrank();

        // Just verify no revert
        assertTrue(true);
    }

    function testDeactivateCreator() public {
        vm.prank(creator1);
        registry.registerCreator(
            "Alice Creator",
            "A talented artist",
            "QmYh2L4P7Q6R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H",
            "Art",
            new string[](0)
        );

        vm.prank(creator1);
        registry.deactivateProfile();

        // Just verify no revert
        assertTrue(true);
    }
}
