"""Unit tests for the allocation models"""

from django.test import TestCase
from django.utils.safestring import SafeString

from coldfront.core.test_helpers.factories import (
    AllocationAttributeFactory,
    AllocationAttributeTypeFactory,
    AllocationAttributeUsageFactory,
    AllocationFactory,
    ResourceFactory,
)


class AllocationModelTests(TestCase):
    """tests for Allocation model"""

    @classmethod
    def setUpTestData(cls):
        """Set up project to test model properties and methods"""
        cls.allocation = AllocationFactory()
        cls.allocation.resources.add(ResourceFactory(name="holylfs07/tier1"))

    def test_allocation_str(self):
        """test that allocation str method returns correct string"""
        allocation_str = "%s (%s)" % (
            self.allocation.get_parent_resource.name,
            self.allocation.project.pi,
        )
        self.assertEqual(str(self.allocation), allocation_str)

    def test_get_information_empty(self):
        """test that get_information returns an empty string when there are no attributes"""
        self.assertEqual(self.allocation.get_information, "")

    def test_get_information_escapes_values(self):
        """test that get_information escapes attribute names and tolerates braces"""
        attribute_type = AllocationAttributeTypeFactory(name="Quota {TB} <b>")
        attribute = AllocationAttributeFactory(
            allocation=self.allocation,
            allocation_attribute_type=attribute_type,
        )
        AllocationAttributeUsageFactory(allocation_attribute=attribute)

        information = self.allocation.get_information
        self.assertIsInstance(information, SafeString)
        self.assertEqual(information, "Quota {TB} &lt;b&gt;: 1024.0/2048 (50.0 %) <br>")
