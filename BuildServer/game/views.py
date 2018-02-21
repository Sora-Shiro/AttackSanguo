# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from channels.handler import AsgiRequest, AsgiHandler
from django.shortcuts import HttpResponse


# Create your views here.

def socket(request):
    return HttpResponse("hello world")
